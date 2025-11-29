using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/cashbook")]
[SwaggerTag("Cash book management endpoints")]
public class CashBookController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CashBookController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all cashbook entries")]
    [SwaggerResponse(200, "Cashbook entries retrieved successfully")]
    public async Task<IActionResult> GetCashBookEntries([FromQuery] int pageSize = 50)
    {
        var entries = await _unitOfWork.CashBooks.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();
        
        var result = entries
            .OrderByDescending(c => c.Date)
            .ThenByDescending(c => c.Id)
            .Take(pageSize)
            .Select(c => new
            {
                c.Id,
                c.Date,
                ModuleType = c.ModuleType.ToString(),
                c.ModuleId,
                c.Description,
                c.CurrencyId,
                Currency = currencies.FirstOrDefault(cur => cur.Id == c.CurrencyId)?.Code ?? "",
                CurrencySymbol = currencies.FirstOrDefault(cur => cur.Id == c.CurrencyId)?.Symbol ?? "",
                c.OriginalAmount,
                c.ExchangeRate,
                c.CashIn,
                c.CashOut,
                c.BalanceAfter
            });
            
        return Ok(result);
    }

    [HttpGet("balance")]
    [SwaggerOperation(Summary = "Get current cash balance")]
    [SwaggerResponse(200, "Current cash balance")]
    public async Task<IActionResult> GetCashBalance()
    {
        var entries = await _unitOfWork.CashBooks.GetAllAsync();
        var lastEntry = entries.OrderByDescending(c => c.Date).ThenByDescending(c => c.Id).FirstOrDefault();
        var balance = lastEntry?.BalanceAfter ?? 0;
        
        return Ok(new { Balance = balance });
    }

    [HttpGet("by-module/{moduleType}/{moduleId}")]
    [SwaggerOperation(Summary = "Get cashbook entries by module")]
    [SwaggerResponse(200, "Module cashbook entries retrieved successfully")]
    public async Task<IActionResult> GetCashBookEntriesByModule(string moduleType, int moduleId)
    {
        var entries = await _unitOfWork.CashBooks.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();
        
        var filteredEntries = entries
            .Where(c => c.ModuleType.ToString().Equals(moduleType, StringComparison.OrdinalIgnoreCase) && c.ModuleId == moduleId)
            .OrderByDescending(c => c.Date)
            .Select(c => new
            {
                c.Id,
                c.Date,
                ModuleType = c.ModuleType.ToString(),
                c.ModuleId,
                c.Description,
                c.CurrencyId,
                Currency = currencies.FirstOrDefault(cur => cur.Id == c.CurrencyId)?.Code ?? "",
                CurrencySymbol = currencies.FirstOrDefault(cur => cur.Id == c.CurrencyId)?.Symbol ?? "",
                c.OriginalAmount,
                c.ExchangeRate,
                c.CashIn,
                c.CashOut,
                c.BalanceAfter
            });
            
        return Ok(filteredEntries);
    }
}