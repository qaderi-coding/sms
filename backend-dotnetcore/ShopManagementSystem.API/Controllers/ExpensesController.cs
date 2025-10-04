using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/expenses")]
[SwaggerTag("Expense management endpoints")]
public class ExpensesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ExpensesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all expenses")]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
    {
        var expenses = await _unitOfWork.Expenses.GetAllAsync();
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get expense by ID")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();
        return Ok(expense);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create expense")]
    public async Task<ActionResult<Expense>> CreateExpense([FromBody] Expense expense)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Create transaction first
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.Expense,
                PartyType = Domain.Enums.PartyType.None,
                OriginalAmount = expense.Amount,
                Currency = expense.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = expense.Amount,
                Notes = $"Expense: {expense.Category}"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            expense.TransactionId = createdTransaction.Id;
            var createdExpense = await _unitOfWork.Expenses.AddAsync(expense);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetExpense), new { id = createdExpense.Id }, createdExpense);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update expense")]
    public async Task<ActionResult<Expense>> UpdateExpense(int id, [FromBody] Expense expense)
    {
        var existingExpense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (existingExpense == null) return NotFound();

        existingExpense.Category = expense.Category;
        existingExpense.Amount = expense.Amount;
        existingExpense.Currency = expense.Currency;
        existingExpense.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Expenses.UpdateAsync(existingExpense);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingExpense);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete expense")]
    public async Task<ActionResult> DeleteExpense(int id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();

        await _unitOfWork.Expenses.DeleteAsync(expense);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}