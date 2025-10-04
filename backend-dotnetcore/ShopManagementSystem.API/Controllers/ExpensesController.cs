using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
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
    [SwaggerResponse(200, "Expenses retrieved successfully", typeof(IEnumerable<ExpenseDto>))]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
    {
        var expenses = await _unitOfWork.Expenses.GetAllAsync();
        var expenseDtos = expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Category = e.Category,
            Amount = e.Amount,
            Currency = e.Currency,
            CreatedAt = e.CreatedAt
        });
        return Ok(expenseDtos);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get expense by ID")]
    [SwaggerResponse(200, "Expense found", typeof(ExpenseDto))]
    [SwaggerResponse(404, "Expense not found")]
    public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();
        
        var expenseDto = new ExpenseDto
        {
            Id = expense.Id,
            Category = expense.Category,
            Amount = expense.Amount,
            Currency = expense.Currency,
            CreatedAt = expense.CreatedAt
        };
        return Ok(expenseDto);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create expense")]
    [SwaggerResponse(201, "Expense created successfully", typeof(ExpenseDto))]
    public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] CreateExpenseDto createExpenseDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Create transaction first
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.Expense,
                PartyType = Domain.Enums.PartyType.None,
                OriginalAmount = createExpenseDto.Amount,
                Currency = createExpenseDto.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = createExpenseDto.Amount,
                Notes = $"Expense: {createExpenseDto.Category}"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            var expense = new Expense
            {
                TransactionId = createdTransaction.Id,
                Category = createExpenseDto.Category,
                Amount = createExpenseDto.Amount,
                Currency = createExpenseDto.Currency
            };
            
            var createdExpense = await _unitOfWork.Expenses.AddAsync(expense);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var expenseDto = new ExpenseDto
            {
                Id = createdExpense.Id,
                Category = createdExpense.Category,
                Amount = createdExpense.Amount,
                Currency = createdExpense.Currency,
                CreatedAt = createdExpense.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetExpense), new { id = expenseDto.Id }, expenseDto);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update expense")]
    [SwaggerResponse(200, "Expense updated successfully", typeof(ExpenseDto))]
    [SwaggerResponse(404, "Expense not found")]
    public async Task<ActionResult<ExpenseDto>> UpdateExpense(int id, [FromBody] UpdateExpenseDto updateExpenseDto)
    {
        var existingExpense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (existingExpense == null) return NotFound();

        existingExpense.Category = updateExpenseDto.Category;
        existingExpense.Amount = updateExpenseDto.Amount;
        existingExpense.Currency = updateExpenseDto.Currency;
        existingExpense.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Expenses.UpdateAsync(existingExpense);
        await _unitOfWork.SaveChangesAsync();
        
        var expenseDto = new ExpenseDto
        {
            Id = existingExpense.Id,
            Category = existingExpense.Category,
            Amount = existingExpense.Amount,
            Currency = existingExpense.Currency,
            CreatedAt = existingExpense.CreatedAt
        };
        
        return Ok(expenseDto);
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