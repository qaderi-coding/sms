using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/core/currencies")]
[SwaggerTag("Currency management endpoints")]
public class CurrenciesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CurrenciesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all currencies")]
    public async Task<ActionResult<IEnumerable<Currency>>> GetCurrencies()
    {
        var currencies = await _unitOfWork.Currencies.GetAllAsync();
        return Ok(currencies);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get currency by ID")]
    public async Task<ActionResult<Currency>> GetCurrency(int id)
    {
        var currency = await _unitOfWork.Currencies.GetByIdAsync(id);
        if (currency == null) return NotFound();
        return Ok(currency);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create currency")]
    public async Task<ActionResult<Currency>> CreateCurrency([FromBody] Currency currency)
    {
        var createdCurrency = await _unitOfWork.Currencies.AddAsync(currency);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCurrency), new { id = createdCurrency.Id }, createdCurrency);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update currency")]
    public async Task<ActionResult<Currency>> UpdateCurrency(int id, [FromBody] Currency currency)
    {
        var existingCurrency = await _unitOfWork.Currencies.GetByIdAsync(id);
        if (existingCurrency == null) return NotFound();

        existingCurrency.Code = currency.Code;
        existingCurrency.Name = currency.Name;
        existingCurrency.Symbol = currency.Symbol;
        existingCurrency.IsActive = currency.IsActive;
        existingCurrency.IsBaseCurrency = currency.IsBaseCurrency;
        existingCurrency.UpdatedAt = DateTime.UtcNow;

        // Ensure only one base currency
        if (currency.IsBaseCurrency)
        {
            var allCurrencies = await _unitOfWork.Currencies.GetAllAsync();
            foreach (var curr in allCurrencies.Where(c => c.Id != id && c.IsBaseCurrency))
            {
                curr.IsBaseCurrency = false;
                await _unitOfWork.Currencies.UpdateAsync(curr);
            }
        }

        await _unitOfWork.Currencies.UpdateAsync(existingCurrency);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingCurrency);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete currency")]
    public async Task<ActionResult> DeleteCurrency(int id)
    {
        var currency = await _unitOfWork.Currencies.GetByIdAsync(id);
        if (currency == null) return NotFound();

        await _unitOfWork.Currencies.DeleteAsync(currency);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}