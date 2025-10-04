using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/payments")]
[SwaggerTag("Payment management endpoints")]
public class PaymentsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all payments",
        Description = "Retrieves payment history"
    )]
    [SwaggerResponse(200, "Payments retrieved successfully", typeof(IEnumerable<Payment>))]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
    {
        var payments = await _unitOfWork.Payments.GetAllAsync();
        return Ok(payments);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get payment by ID")]
    public async Task<ActionResult<Payment>> GetPayment(int id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null) return NotFound();
        return Ok(payment);
    }

    [HttpPost("receive")]
    [SwaggerOperation(
        Summary = "Receive payment",
        Description = "Records a payment received from customer"
    )]
    [SwaggerResponse(201, "Payment recorded successfully", typeof(Payment))]
    public async Task<ActionResult<Payment>> ReceivePayment(
        [FromBody, SwaggerParameter("Payment data")] Payment payment)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.PaymentReceived,
                PartyType = payment.PartyType,
                PartyId = payment.PartyId,
                OriginalAmount = payment.Amount,
                Currency = payment.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = payment.Amount,
                Notes = "Payment Received"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            payment.TransactionId = createdTransaction.Id;
            var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetPayment), new { id = createdPayment.Id }, createdPayment);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPost("make")]
    [SwaggerOperation(
        Summary = "Make payment",
        Description = "Records a payment made to supplier"
    )]
    [SwaggerResponse(201, "Payment recorded successfully", typeof(Payment))]
    public async Task<ActionResult<Payment>> MakePayment(
        [FromBody, SwaggerParameter("Payment data")] Payment payment)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.PaymentMade,
                PartyType = payment.PartyType,
                PartyId = payment.PartyId,
                OriginalAmount = payment.Amount,
                Currency = payment.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = payment.Amount,
                Notes = "Payment Made"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            payment.TransactionId = createdTransaction.Id;
            var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetPayment), new { id = createdPayment.Id }, createdPayment);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update payment")]
    public async Task<ActionResult<Payment>> UpdatePayment(int id, [FromBody] Payment payment)
    {
        var existingPayment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (existingPayment == null) return NotFound();

        existingPayment.Amount = payment.Amount;
        existingPayment.Currency = payment.Currency;
        existingPayment.Method = payment.Method;
        existingPayment.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Payments.UpdateAsync(existingPayment);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingPayment);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete payment")]
    public async Task<ActionResult> DeletePayment(int id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null) return NotFound();

        await _unitOfWork.Payments.DeleteAsync(payment);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}