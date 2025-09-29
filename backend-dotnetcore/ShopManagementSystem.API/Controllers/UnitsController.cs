using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/units")]
[SwaggerTag("Unit management endpoints")]
public class UnitsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public UnitsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all units")]
    public async Task<ActionResult<IEnumerable<Unit>>> GetUnits()
    {
        var units = await _unitOfWork.Units.GetAllAsync();
        return Ok(units);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get unit by ID")]
    public async Task<ActionResult<Unit>> GetUnit(int id)
    {
        var unit = await _unitOfWork.Units.GetByIdAsync(id);
        if (unit == null) return NotFound();
        return Ok(unit);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create unit")]
    public async Task<ActionResult<Unit>> CreateUnit([FromBody] Unit unit)
    {
        var createdUnit = await _unitOfWork.Units.AddAsync(unit);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUnit), new { id = createdUnit.Id }, createdUnit);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update unit")]
    public async Task<ActionResult<Unit>> UpdateUnit(int id, [FromBody] Unit unit)
    {
        var existingUnit = await _unitOfWork.Units.GetByIdAsync(id);
        if (existingUnit == null) return NotFound();

        existingUnit.Name = unit.Name;
        existingUnit.Symbol = unit.Symbol;
        existingUnit.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Units.UpdateAsync(existingUnit);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingUnit);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete unit")]
    public async Task<ActionResult> DeleteUnit(int id)
    {
        var unit = await _unitOfWork.Units.GetByIdAsync(id);
        if (unit == null) return NotFound();

        await _unitOfWork.Units.DeleteAsync(unit);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}