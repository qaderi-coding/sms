using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Domain.Enums;
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
    [SwaggerResponse(200, "Payments retrieved successfully", typeof(IEnumerable<PaymentDto>))]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
    {
        var payments = await _unitOfWork.Payments.GetAllAsync();
        var paymentDtos = payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            PartyType = p.PartyType,
            PartyId = p.PartyId,
            PartyName = GetPartyName(p.PartyType, p.PartyId),
            Amount = p.Amount,
            Currency = p.Currency,
            Method = p.Method,
            CreatedAt = p.CreatedAt
        });
        return Ok(paymentDtos);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get payment by ID")]
    [SwaggerResponse(200, "Payment found", typeof(PaymentDto))]
    [SwaggerResponse(404, "Payment not found")]
    public async Task<ActionResult<PaymentDto>> GetPayment(int id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null) return NotFound();
        
        var paymentDto = new PaymentDto
        {
            Id = payment.Id,
            PartyType = payment.PartyType,
            PartyId = payment.PartyId,
            PartyName = GetPartyName(payment.PartyType, payment.PartyId),
            Amount = payment.Amount,
            Currency = payment.Currency,
            Method = payment.Method,
            CreatedAt = payment.CreatedAt
        };
        return Ok(paymentDto);
    }

    [HttpPost("receive")]
    [SwaggerOperation(
        Summary = "Receive payment",
        Description = "Records a payment received from customer"
    )]
    [SwaggerResponse(201, "Payment recorded successfully", typeof(PaymentDto))]
    public async Task<ActionResult<PaymentDto>> ReceivePayment(
        [FromBody, SwaggerParameter("Payment data")] CreatePaymentDto createPaymentDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.PaymentReceived,
                PartyType = createPaymentDto.PartyType,
                PartyId = createPaymentDto.PartyId,
                OriginalAmount = createPaymentDto.Amount,
                Currency = createPaymentDto.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = createPaymentDto.Amount,
                Notes = "Payment Received"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var payment = new Payment
            {
                TransactionId = createdTransaction.Id,
                PartyType = createPaymentDto.PartyType,
                PartyId = createPaymentDto.PartyId,
                Amount = createPaymentDto.Amount,
                Currency = createPaymentDto.Currency,
                Method = createPaymentDto.Method
            };
            
            var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var paymentDto = new PaymentDto
            {
                Id = createdPayment.Id,
                PartyType = createdPayment.PartyType,
                PartyId = createdPayment.PartyId,
                PartyName = GetPartyName(createdPayment.PartyType, createdPayment.PartyId),
                Amount = createdPayment.Amount,
                Currency = createdPayment.Currency,
                Method = createdPayment.Method,
                CreatedAt = createdPayment.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetPayment), new { id = paymentDto.Id }, paymentDto);
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
    [SwaggerResponse(201, "Payment recorded successfully", typeof(PaymentDto))]
    public async Task<ActionResult<PaymentDto>> MakePayment(
        [FromBody, SwaggerParameter("Payment data")] CreatePaymentDto createPaymentDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.PaymentMade,
                PartyType = createPaymentDto.PartyType,
                PartyId = createPaymentDto.PartyId,
                OriginalAmount = createPaymentDto.Amount,
                Currency = createPaymentDto.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = createPaymentDto.Amount,
                Notes = "Payment Made"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var payment = new Payment
            {
                TransactionId = createdTransaction.Id,
                PartyType = createPaymentDto.PartyType,
                PartyId = createPaymentDto.PartyId,
                Amount = createPaymentDto.Amount,
                Currency = createPaymentDto.Currency,
                Method = createPaymentDto.Method
            };
            
            var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var paymentDto = new PaymentDto
            {
                Id = createdPayment.Id,
                PartyType = createdPayment.PartyType,
                PartyId = createdPayment.PartyId,
                PartyName = GetPartyName(createdPayment.PartyType, createdPayment.PartyId),
                Amount = createdPayment.Amount,
                Currency = createdPayment.Currency,
                Method = createdPayment.Method,
                CreatedAt = createdPayment.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetPayment), new { id = paymentDto.Id }, paymentDto);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update payment")]
    [SwaggerResponse(200, "Payment updated successfully", typeof(PaymentDto))]
    [SwaggerResponse(404, "Payment not found")]
    public async Task<ActionResult<PaymentDto>> UpdatePayment(int id, [FromBody] UpdatePaymentDto updatePaymentDto)
    {
        var existingPayment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (existingPayment == null) return NotFound();

        existingPayment.Amount = updatePaymentDto.Amount;
        existingPayment.Currency = updatePaymentDto.Currency;
        existingPayment.Method = updatePaymentDto.Method;
        existingPayment.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Payments.UpdateAsync(existingPayment);
        await _unitOfWork.SaveChangesAsync();
        
        var paymentDto = new PaymentDto
        {
            Id = existingPayment.Id,
            PartyType = existingPayment.PartyType,
            PartyId = existingPayment.PartyId,
            PartyName = GetPartyName(existingPayment.PartyType, existingPayment.PartyId),
            Amount = existingPayment.Amount,
            Currency = existingPayment.Currency,
            Method = existingPayment.Method,
            CreatedAt = existingPayment.CreatedAt
        };
        
        return Ok(paymentDto);
    }
    
    private string GetPartyName(PartyType partyType, int partyId)
    {
        return partyType switch
        {
            PartyType.Customer => $"Customer-{partyId}",
            PartyType.Supplier => $"Supplier-{partyId}",
            _ => "Unknown"
        };
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