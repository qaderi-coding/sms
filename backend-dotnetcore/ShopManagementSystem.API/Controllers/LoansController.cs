using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/loans")]
public class LoansController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public LoansController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanDto>>> GetLoans()
    {
        var loans = await _unitOfWork.Loans.GetAllAsync();
        var loanDtos = loans.Select(l => new LoanDto
        {
            Id = l.Id,
            Name = l.Name,
            Type = l.Type,
            OpeningBalance = l.OpeningBalance,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt
        });
        return Ok(loanDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LoanDto>> GetLoan(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();
        
        var loanDto = new LoanDto
        {
            Id = loan.Id,
            Name = loan.Name,
            Type = loan.Type,
            OpeningBalance = loan.OpeningBalance,
            CreatedAt = loan.CreatedAt,
            UpdatedAt = loan.UpdatedAt
        };
        return Ok(loanDto);
    }

    [HttpPost]
    public async Task<ActionResult<LoanDto>> CreateLoan([FromBody] CreateLoanRequest request)
    {
        var loan = new Loan
        {
            Name = request.Name,
            Type = request.Type,
            OpeningBalance = request.OpeningBalance
        };

        var createdLoan = await _unitOfWork.Loans.AddAsync(loan);
        await _unitOfWork.SaveChangesAsync();

        // Create initial transaction if opening balance exists
        if (request.OpeningBalance != 0)
        {
            var transaction = new LoanTransaction
            {
                LoanId = createdLoan.Id,
                Date = DateTime.UtcNow,
                Description = "Opening Balance",
                AmountIn = request.OpeningBalance, // Opening balance is always AmountIn
                AmountOut = 0,
                BalanceAfter = request.OpeningBalance
            };

            await _unitOfWork.LoanTransactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();
        }

        var loanDto = new LoanDto
        {
            Id = createdLoan.Id,
            Name = createdLoan.Name,
            Type = createdLoan.Type,
            OpeningBalance = createdLoan.OpeningBalance,
            CreatedAt = createdLoan.CreatedAt,
            UpdatedAt = createdLoan.UpdatedAt
        };
        
        return CreatedAtAction(nameof(GetLoan), new { id = createdLoan.Id }, loanDto);
    }

    [HttpPost("{id}/transactions")]
    public async Task<ActionResult<LoanTransactionDto>> CreateLoanTransaction(int id, [FromBody] CreateLoanTransactionRequest request)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound("Loan not found");

        // Get current balance
        var lastTransaction = (await _unitOfWork.LoanTransactions.GetAllAsync())
            .Where(t => t.LoanId == id)
            .OrderByDescending(t => t.Id) // Use ID for chronological order
            .FirstOrDefault();

        var currentBalance = lastTransaction?.BalanceAfter ?? loan.OpeningBalance;

        // Calculate new balance - same logic for both loan types
        // AmountIn increases the balance, AmountOut decreases the balance
        var newBalance = currentBalance + request.AmountIn - request.AmountOut;

        var transaction = new LoanTransaction
        {
            LoanId = id,
            Date = request.Date,
            Description = request.Description,
            AmountIn = request.AmountIn,
            AmountOut = request.AmountOut,
            BalanceAfter = newBalance
        };

        var createdTransaction = await _unitOfWork.LoanTransactions.AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();

        var transactionDto = new LoanTransactionDto
        {
            Id = createdTransaction.Id,
            LoanId = createdTransaction.LoanId,
            Date = createdTransaction.Date,
            Description = createdTransaction.Description,
            AmountIn = createdTransaction.AmountIn,
            AmountOut = createdTransaction.AmountOut,
            BalanceAfter = createdTransaction.BalanceAfter
        };
        
        return CreatedAtAction(nameof(GetLoanTransaction), new { loanId = id, transactionId = createdTransaction.Id }, transactionDto);
    }

    [HttpGet("{loanId}/transactions/{transactionId}")]
    public async Task<ActionResult<LoanTransactionDto>> GetLoanTransaction(int loanId, int transactionId)
    {
        var transaction = await _unitOfWork.LoanTransactions.GetByIdAsync(transactionId);
        if (transaction == null || transaction.LoanId != loanId) return NotFound();
        
        var transactionDto = new LoanTransactionDto
        {
            Id = transaction.Id,
            LoanId = transaction.LoanId,
            Date = transaction.Date,
            Description = transaction.Description,
            AmountIn = transaction.AmountIn,
            AmountOut = transaction.AmountOut,
            BalanceAfter = transaction.BalanceAfter
        };
        return Ok(transactionDto);
    }

    [HttpGet("{id}/transactions")]
    public async Task<ActionResult<IEnumerable<LoanTransactionDto>>> GetLoanTransactions(int id)
    {
        var transactions = (await _unitOfWork.LoanTransactions.GetAllAsync())
            .Where(t => t.LoanId == id)
            .OrderBy(t => t.Date)
            .ThenBy(t => t.Id)
            .Select(t => new LoanTransactionDto
            {
                Id = t.Id,
                LoanId = t.LoanId,
                Date = t.Date,
                Description = t.Description,
                AmountIn = t.AmountIn,
                AmountOut = t.AmountOut,
                BalanceAfter = t.BalanceAfter
            });
        return Ok(transactions);
    }

    [HttpGet("{id}/balance")]
    public async Task<ActionResult<decimal>> GetLoanBalance(int id)
    {
        var loan = await _unitOfWork.Loans.GetByIdAsync(id);
        if (loan == null) return NotFound();

        var lastTransaction = (await _unitOfWork.LoanTransactions.GetAllAsync())
            .Where(t => t.LoanId == id)
            .OrderByDescending(t => t.Id) // Use ID for chronological order since transactions are created sequentially
            .FirstOrDefault();

        var balance = lastTransaction?.BalanceAfter ?? loan.OpeningBalance;
        return Ok(balance);
    }
}

public class LoanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class LoanTransactionDto
{
    public int Id { get; set; }
    public int LoanId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
    public decimal BalanceAfter { get; set; }
}

public class CreateLoanRequest
{
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
}

public class CreateLoanTransactionRequest
{
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
}