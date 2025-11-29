using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IFinancialService _financialService;
    private readonly IUnitOfWork _unitOfWork;

    public PaymentsController(IFinancialService financialService, IUnitOfWork unitOfWork)
    {
        _financialService = financialService;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("customer/{customerId}")]
    public async Task<IActionResult> RecordCustomerPayment(int customerId, [FromBody] CustomerPaymentRequest request)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            await _financialService.RecordCustomerPaymentAsync(
                customerId,
                request.Date,
                request.Amount,
                request.CurrencyId,
                request.ExchangeRate,
                request.Description
            );

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new { Message = "Customer payment recorded successfully" });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("supplier/{supplierId}")]
    public async Task<IActionResult> RecordSupplierPayment(int supplierId, [FromBody] SupplierPaymentRequest request)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            await _financialService.RecordSupplierPaymentAsync(
                supplierId,
                request.Date,
                request.Amount,
                request.CurrencyId,
                request.ExchangeRate,
                request.Description
            );

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return Ok(new { Message = "Supplier payment recorded successfully" });
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("customer/{customerId}/balance")]
    public async Task<IActionResult> GetCustomerBalance(int customerId)
    {
        var balance = await _financialService.GetCustomerBalanceAsync(customerId);
        return Ok(new { CustomerId = customerId, Balance = balance });
    }

    [HttpGet("supplier/{supplierId}/balance")]
    public async Task<IActionResult> GetSupplierBalance(int supplierId)
    {
        var balance = await _financialService.GetSupplierBalanceAsync(supplierId);
        return Ok(new { SupplierId = supplierId, Balance = balance });
    }

    [HttpGet("cashbook")]
    public async Task<IActionResult> GetCashbook()
    {
        var cashbooks = await _unitOfWork.CashBooks.GetAllAsync();
        return Ok(cashbooks.OrderByDescending(c => c.Date).Take(20));
    }
}

public class CustomerPaymentRequest
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int CurrencyId { get; set; } = 1; // Default to AFN
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Description { get; set; } = string.Empty;
}

public class SupplierPaymentRequest
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int CurrencyId { get; set; } = 1; // Default to AFN
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Description { get; set; } = string.Empty;
}