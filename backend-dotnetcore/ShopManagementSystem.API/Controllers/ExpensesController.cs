using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ExpensesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
    {
        var expenses = await _unitOfWork.Expenses.GetAllAsync();
        var expenseTypes = await _unitOfWork.ExpenseTypes.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();
        
        var dtos = expenses.Select(e => new ExpenseDto
        {
            Id = e.Id,
            Date = e.Date,
            Amount = e.Amount,
            ExpenseTypeId = e.ExpenseTypeId,
            ExpenseTypeName = expenseTypes.FirstOrDefault(et => et.Id == e.ExpenseTypeId)?.Name ?? "Unknown",
            CurrencyId = e.CurrencyId,
            CurrencyCode = currencies.FirstOrDefault(c => c.Id == e.CurrencyId)?.Code ?? "Unknown",
            ExchangeRate = e.ExchangeRate,
            Description = e.Description,
            CreatedAt = e.CreatedAt
        });
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();
        
        var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(expense.ExpenseTypeId);
        var currency = await _unitOfWork.Currencies.GetByIdAsync(expense.CurrencyId);
        
        var dto = new ExpenseDto
        {
            Id = expense.Id,
            Date = expense.Date,
            Amount = expense.Amount,
            ExpenseTypeId = expense.ExpenseTypeId,
            ExpenseTypeName = expenseType?.Name ?? "Unknown",
            CurrencyId = expense.CurrencyId,
            CurrencyCode = currency?.Code ?? "Unknown",
            ExchangeRate = expense.ExchangeRate,
            Description = expense.Description,
            CreatedAt = expense.CreatedAt
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] CreateExpenseRequest request)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Validate expense type exists
            var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(request.ExpenseTypeId);
            if (expenseType == null) return BadRequest("Invalid expense type");
            
            // Validate currency exists
            var currency = await _unitOfWork.Currencies.GetByIdAsync(request.CurrencyId);
            if (currency == null) return BadRequest("Invalid currency");

            var expense = new Expense
            {
                Date = request.Date,
                Amount = request.Amount,
                ExpenseTypeId = request.ExpenseTypeId,
                CurrencyId = request.CurrencyId,
                ExchangeRate = request.ExchangeRate,
                Description = request.Description
            };
            
            var created = await _unitOfWork.Expenses.AddAsync(expense);
            await _unitOfWork.SaveChangesAsync();

            // Create cashbook entry for expense (cash out)
            var cashbookEntry = new CashBook
            {
                Date = request.Date,
                Description = $"Expense: {expenseType.Name} - {request.Description}",
                CashIn = 0,
                CashOut = request.Amount,
                CurrencyId = request.CurrencyId,
                ExchangeRate = request.ExchangeRate,
                ModuleType = ModuleType.Expense,
                ModuleId = created.Id
            };

            await _unitOfWork.CashBooks.AddAsync(cashbookEntry);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();
            
            var dto = new ExpenseDto
            {
                Id = created.Id,
                Date = created.Date,
                Amount = created.Amount,
                ExpenseTypeId = created.ExpenseTypeId,
                ExpenseTypeName = expenseType.Name,
                CurrencyId = created.CurrencyId,
                CurrencyCode = currency.Code,
                ExchangeRate = created.ExchangeRate,
                Description = created.Description,
                CreatedAt = created.CreatedAt
            };
            
            return CreatedAtAction(nameof(GetExpense), new { id = dto.Id }, dto);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExpenseDto>> UpdateExpense(int id, [FromBody] UpdateExpenseRequest request)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();

        // Validate expense type exists
        var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(request.ExpenseTypeId);
        if (expenseType == null) return BadRequest("Invalid expense type");
        
        // Validate currency exists
        var currency = await _unitOfWork.Currencies.GetByIdAsync(request.CurrencyId);
        if (currency == null) return BadRequest("Invalid currency");

        expense.Date = request.Date;
        expense.Amount = request.Amount;
        expense.ExpenseTypeId = request.ExpenseTypeId;
        expense.CurrencyId = request.CurrencyId;
        expense.ExchangeRate = request.ExchangeRate;
        expense.Description = request.Description;
        expense.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Expenses.UpdateAsync(expense);
        await _unitOfWork.SaveChangesAsync();
        
        var dto = new ExpenseDto
        {
            Id = expense.Id,
            Date = expense.Date,
            Amount = expense.Amount,
            ExpenseTypeId = expense.ExpenseTypeId,
            ExpenseTypeName = expenseType.Name,
            CurrencyId = expense.CurrencyId,
            CurrencyCode = currency.Code,
            ExchangeRate = expense.ExchangeRate,
            Description = expense.Description,
            CreatedAt = expense.CreatedAt
        };
        
        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExpense(int id)
    {
        var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
        if (expense == null) return NotFound();

        await _unitOfWork.Expenses.DeleteAsync(expense);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}

public class ExpenseDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int ExpenseTypeId { get; set; }
    public string ExpenseTypeName { get; set; } = string.Empty;
    public int CurrencyId { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public decimal ExchangeRate { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateExpenseRequest
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int ExpenseTypeId { get; set; }
    public int CurrencyId { get; set; }
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Description { get; set; } = string.Empty;
}

public class UpdateExpenseRequest
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int ExpenseTypeId { get; set; }
    public int CurrencyId { get; set; }
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Description { get; set; } = string.Empty;
}