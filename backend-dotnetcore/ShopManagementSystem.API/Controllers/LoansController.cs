using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
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
    [SwaggerResponse(200, "Loans retrieved successfully", typeof(IEnumerable<LoanDto>))]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetLoans()
    {
        var loans = await _unitOfWork.Loans.GetAllAsync();
        var loanDtos = loans.Select(l => new LoanDto
        {
            Id = l.Id,
            PartyType = l.PartyType,
            PartyId = l.PartyId,
            PartyName = GetPartyName(l.PartyType, l.PartyId),
            Amount = l.Amount,
            Currency = l.Currency,
            Status = l.Status,
            CreatedAt = l.CreatedAt
        });
        return Ok(loanDtos);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get loan by ID")]
    [SwaggerResponse(200, "Loan found", typeof(LoanDto))]
    [SwaggerResponse(404, "Loan not found")]
    public async Task<ActionResult<LoanDto>> GetLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();
        
        var loanDto = new LoanDto
        {
            Id = loan.Id,
            PartyType = loan.PartyType,
            PartyId = loan.PartyId,
            PartyName = GetPartyName(loan.PartyType, loan.PartyId),
            Amount = loan.Amount,
            Currency = loan.Currency,
            Status = loan.Status,
            CreatedAt = loan.CreatedAt
        };
        return Ok(loanDto);
    }

    [HttpPost("give")]
    [SwaggerOperation(Summary = "Give loan", Description = "Records a loan given to customer/supplier")]
    [SwaggerResponse(201, "Loan given successfully", typeof(LoanDto))]
    public async Task<ActionResult<LoanDto>> GiveLoan([FromBody] CreateLoanDto createLoanDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = TransactionType.LoanGiven,
                PartyType = createLoanDto.PartyType,
                PartyId = createLoanDto.PartyId,
                OriginalAmount = createLoanDto.Amount,
                Currency = createLoanDto.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = createLoanDto.Amount,
                Notes = "Loan Given"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var loan = new Loan
            {
                TransactionId = createdTransaction.Id,
                PartyType = createLoanDto.PartyType,
                PartyId = createLoanDto.PartyId,
                Amount = createLoanDto.Amount,
                Currency = createLoanDto.Currency,
                Status = LoanStatus.Active
            };
            
            var createdLoan = await _unitOfWork.Loans.AddAsync(loan);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var loanDto = new LoanDto
            {
                Id = createdLoan.Id,
                PartyType = createdLoan.PartyType,
                PartyId = createdLoan.PartyId,
                PartyName = GetPartyName(createdLoan.PartyType, createdLoan.PartyId),
                Amount = createdLoan.Amount,
                Currency = createdLoan.Currency,
                Status = createdLoan.Status,
                CreatedAt = createdLoan.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetLoan), new { id = loanDto.Id }, loanDto);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPost("receive")]
    [SwaggerOperation(Summary = "Receive loan", Description = "Records a loan received from customer/supplier")]
    [SwaggerResponse(201, "Loan received successfully", typeof(LoanDto))]
    public async Task<ActionResult<LoanDto>> ReceiveLoan([FromBody] CreateLoanDto createLoanDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = TransactionType.LoanReceived,
                PartyType = createLoanDto.PartyType,
                PartyId = createLoanDto.PartyId,
                OriginalAmount = createLoanDto.Amount,
                Currency = createLoanDto.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = createLoanDto.Amount,
                Notes = "Loan Received"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var loan = new Loan
            {
                TransactionId = createdTransaction.Id,
                PartyType = createLoanDto.PartyType,
                PartyId = createLoanDto.PartyId,
                Amount = createLoanDto.Amount,
                Currency = createLoanDto.Currency,
                Status = LoanStatus.Active
            };
            
            var createdLoan = await _unitOfWork.Loans.AddAsync(loan);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var loanDto = new LoanDto
            {
                Id = createdLoan.Id,
                PartyType = createdLoan.PartyType,
                PartyId = createdLoan.PartyId,
                PartyName = GetPartyName(createdLoan.PartyType, createdLoan.PartyId),
                Amount = createdLoan.Amount,
                Currency = createdLoan.Currency,
                Status = createdLoan.Status,
                CreatedAt = createdLoan.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetLoan), new { id = loanDto.Id }, loanDto);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}/close")]
    [SwaggerOperation(Summary = "Close loan", Description = "Marks a loan as closed")]
    [SwaggerResponse(200, "Loan closed successfully", typeof(LoanDto))]
    [SwaggerResponse(404, "Loan not found")]
    public async Task<ActionResult<LoanDto>> CloseLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();

        loan.Status = LoanStatus.Closed;
        loan.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Loans.UpdateAsync(loan);
        await _unitOfWork.SaveChangesAsync();
        
        var loanDto = new LoanDto
        {
            Id = loan.Id,
            PartyType = loan.PartyType,
            PartyId = loan.PartyId,
            PartyName = GetPartyName(loan.PartyType, loan.PartyId),
            Amount = loan.Amount,
            Currency = loan.Currency,
            Status = loan.Status,
            CreatedAt = loan.CreatedAt
        };
        
        return Ok(loanDto);
    }
    
    private string GetPartyName(PartyType partyType, int partyId)
    {
        // This is a simplified implementation - in a real scenario, you'd fetch the actual name
        return partyType switch
        {
            PartyType.Customer => $"Customer-{partyId}",
            PartyType.Supplier => $"Supplier-{partyId}",
            _ => "Unknown"
        };
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