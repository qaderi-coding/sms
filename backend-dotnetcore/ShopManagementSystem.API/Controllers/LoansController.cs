using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Domain.Enums;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/loans")]
[SwaggerTag("Loan management endpoints")]
public class LoansController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public LoansController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all loans")]
    public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
    {
        var loans = await _unitOfWork.Loans.GetAllAsync();
        return Ok(loans);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get loan by ID")]
    public async Task<ActionResult<Loan>> GetLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();
        return Ok(loan);
    }

    [HttpPost("give")]
    [SwaggerOperation(Summary = "Give loan", Description = "Records a loan given to customer/supplier")]
    public async Task<ActionResult<Loan>> GiveLoan([FromBody] Loan loan)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = TransactionType.LoanGiven,
                PartyType = loan.PartyType,
                PartyId = loan.PartyId,
                OriginalAmount = loan.Amount,
                Currency = loan.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = loan.Amount,
                Notes = "Loan Given"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            loan.TransactionId = createdTransaction.Id;
            loan.Status = LoanStatus.Active;
            var createdLoan = await _unitOfWork.Loans.AddAsync(loan);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetLoan), new { id = createdLoan.Id }, createdLoan);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPost("receive")]
    [SwaggerOperation(Summary = "Receive loan", Description = "Records a loan received from customer/supplier")]
    public async Task<ActionResult<Loan>> ReceiveLoan([FromBody] Loan loan)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = TransactionType.LoanReceived,
                PartyType = loan.PartyType,
                PartyId = loan.PartyId,
                OriginalAmount = loan.Amount,
                Currency = loan.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = loan.Amount,
                Notes = "Loan Received"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            loan.TransactionId = createdTransaction.Id;
            loan.Status = LoanStatus.Active;
            var createdLoan = await _unitOfWork.Loans.AddAsync(loan);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetLoan), new { id = createdLoan.Id }, createdLoan);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}/close")]
    [SwaggerOperation(Summary = "Close loan", Description = "Marks a loan as closed")]
    public async Task<ActionResult<Loan>> CloseLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();

        loan.Status = LoanStatus.Closed;
        loan.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Loans.UpdateAsync(loan);
        await _unitOfWork.SaveChangesAsync();
        return Ok(loan);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete loan")]
    public async Task<ActionResult> DeleteLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();

        await _unitOfWork.Loans.DeleteAsync(loan);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}