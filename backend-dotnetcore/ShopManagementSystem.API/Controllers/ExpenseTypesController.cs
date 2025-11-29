using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/expense-types")]
public class ExpenseTypesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ExpenseTypesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseTypeDto>>> GetExpenseTypes()
    {
        var expenseTypes = await _unitOfWork.ExpenseTypes.GetAllAsync();
        var dtos = expenseTypes.Where(et => et.IsActive).Select(et => new ExpenseTypeDto
        {
            Id = et.Id,
            Name = et.Name,
            Description = et.Description,
            IsActive = et.IsActive
        });
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseTypeDto>> GetExpenseType(int id)
    {
        var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(id);
        if (expenseType == null) return NotFound();
        
        var dto = new ExpenseTypeDto
        {
            Id = expenseType.Id,
            Name = expenseType.Name,
            Description = expenseType.Description,
            IsActive = expenseType.IsActive
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseTypeDto>> CreateExpenseType([FromBody] CreateExpenseTypeRequest request)
    {
        var expenseType = new ExpenseType
        {
            Name = request.Name,
            Description = request.Description,
            IsActive = true
        };

        var created = await _unitOfWork.ExpenseTypes.AddAsync(expenseType);
        await _unitOfWork.SaveChangesAsync();

        var dto = new ExpenseTypeDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            IsActive = created.IsActive
        };

        return CreatedAtAction(nameof(GetExpenseType), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExpenseTypeDto>> UpdateExpenseType(int id, [FromBody] UpdateExpenseTypeRequest request)
    {
        var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(id);
        if (expenseType == null) return NotFound();

        expenseType.Name = request.Name;
        expenseType.Description = request.Description;
        expenseType.IsActive = request.IsActive;
        expenseType.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.ExpenseTypes.UpdateAsync(expenseType);
        await _unitOfWork.SaveChangesAsync();

        var dto = new ExpenseTypeDto
        {
            Id = expenseType.Id,
            Name = expenseType.Name,
            Description = expenseType.Description,
            IsActive = expenseType.IsActive
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExpenseType(int id)
    {
        var expenseType = await _unitOfWork.ExpenseTypes.GetByIdAsync(id);
        if (expenseType == null) return NotFound();

        // Soft delete by setting IsActive to false
        expenseType.IsActive = false;
        expenseType.UpdatedAt = DateTime.UtcNow;
        
        await _unitOfWork.ExpenseTypes.UpdateAsync(expenseType);
        await _unitOfWork.SaveChangesAsync();
        
        return NoContent();
    }
}

public class ExpenseTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreateExpenseTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateExpenseTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}