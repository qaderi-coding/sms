using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
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
    [SwaggerResponse(200, "Units retrieved successfully", typeof(IEnumerable<UnitDto>))]
    public async Task<ActionResult<IEnumerable<UnitDto>>> GetUnits()
    {
        var units = await _unitOfWork.Units.GetAllAsync();
        var unitDtos = units.Select(u => new UnitDto
        {
            Id = u.Id,
            Name = u.Name,
            Symbol = u.Symbol,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        });
        return Ok(unitDtos);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get unit by ID")]
    [SwaggerResponse(200, "Unit found", typeof(UnitDto))]
    [SwaggerResponse(404, "Unit not found")]
    public async Task<ActionResult<UnitDto>> GetUnit(int id)
    {
        var unit = await _unitOfWork.Units.GetByIdAsync(id);
        if (unit == null) return NotFound();
        
        var unitDto = new UnitDto
        {
            Id = unit.Id,
            Name = unit.Name,
            Symbol = unit.Symbol,
            CreatedAt = unit.CreatedAt,
            UpdatedAt = unit.UpdatedAt
        };
        return Ok(unitDto);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create unit")]
    [SwaggerResponse(201, "Unit created successfully", typeof(UnitDto))]
    public async Task<ActionResult<UnitDto>> CreateUnit([FromBody] CreateUnitDto createUnitDto)
    {
        var unit = new Unit
        {
            Name = createUnitDto.Name,
            Symbol = createUnitDto.Symbol
        };
        
        var createdUnit = await _unitOfWork.Units.AddAsync(unit);
        await _unitOfWork.SaveChangesAsync();
        
        var unitDto = new UnitDto
        {
            Id = createdUnit.Id,
            Name = createdUnit.Name,
            Symbol = createdUnit.Symbol,
            CreatedAt = createdUnit.CreatedAt,
            UpdatedAt = createdUnit.UpdatedAt
        };
        
        return CreatedAtAction(nameof(GetUnit), new { id = unitDto.Id }, unitDto);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update unit")]
    [SwaggerResponse(200, "Unit updated successfully", typeof(UnitDto))]
    [SwaggerResponse(404, "Unit not found")]
    public async Task<ActionResult<UnitDto>> UpdateUnit(int id, [FromBody] UpdateUnitDto updateUnitDto)
    {
        var existingUnit = await _unitOfWork.Units.GetByIdAsync(id);
        if (existingUnit == null) return NotFound();

        existingUnit.Name = updateUnitDto.Name;
        existingUnit.Symbol = updateUnitDto.Symbol;
        existingUnit.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Units.UpdateAsync(existingUnit);
        await _unitOfWork.SaveChangesAsync();
        
        var unitDto = new UnitDto
        {
            Id = existingUnit.Id,
            Name = existingUnit.Name,
            Symbol = existingUnit.Symbol,
            CreatedAt = existingUnit.CreatedAt,
            UpdatedAt = existingUnit.UpdatedAt
        };
        
        return Ok(unitDto);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete unit")]
    [SwaggerResponse(204, "Unit deleted successfully")]
    [SwaggerResponse(404, "Unit not found")]
    public async Task<ActionResult> DeleteUnit(int id)
    {
        var unit = await _unitOfWork.Units.GetByIdAsync(id);
        if (unit == null) return NotFound();

        await _unitOfWork.Units.DeleteAsync(unit);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}