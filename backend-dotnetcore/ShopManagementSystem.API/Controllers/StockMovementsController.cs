using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/stock-movements")]
[SwaggerTag("Stock movement tracking endpoints")]
public class StockMovementsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public StockMovementsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all stock movements")]
    public async Task<ActionResult<IEnumerable<StockMovement>>> GetStockMovements()
    {
        var stockMovements = await _unitOfWork.StockMovements.GetAllAsync();
        return Ok(stockMovements);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get stock movement by ID")]
    public async Task<ActionResult<StockMovement>> GetStockMovement(int id)
    {
        var stockMovement = await _unitOfWork.StockMovements.GetByIdAsync(id);
        if (stockMovement == null) return NotFound();
        return Ok(stockMovement);
    }

    [HttpGet("by-product/{productItemId}")]
    [SwaggerOperation(Summary = "Get stock movements by product item")]
    public async Task<ActionResult<IEnumerable<StockMovement>>> GetStockMovementsByProduct(int productItemId)
    {
        var stockMovements = await _unitOfWork.StockMovements.FindAsync(sm => sm.ProductItemId == productItemId);
        return Ok(stockMovements);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create stock movement")]
    public async Task<ActionResult<StockMovement>> CreateStockMovement([FromBody] StockMovement stockMovement)
    {
        var createdStockMovement = await _unitOfWork.StockMovements.AddAsync(stockMovement);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStockMovement), new { id = createdStockMovement.Id }, createdStockMovement);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update stock movement")]
    public async Task<ActionResult<StockMovement>> UpdateStockMovement(int id, [FromBody] StockMovement stockMovement)
    {
        var existingStockMovement = await _unitOfWork.StockMovements.GetByIdAsync(id);
        if (existingStockMovement == null) return NotFound();

        existingStockMovement.ProductItemId = stockMovement.ProductItemId;
        existingStockMovement.TransactionType = stockMovement.TransactionType;
        existingStockMovement.Quantity = stockMovement.Quantity;
        existingStockMovement.Notes = stockMovement.Notes;
        existingStockMovement.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.StockMovements.UpdateAsync(existingStockMovement);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingStockMovement);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete stock movement")]
    public async Task<ActionResult> DeleteStockMovement(int id)
    {
        var stockMovement = await _unitOfWork.StockMovements.GetByIdAsync(id);
        if (stockMovement == null) return NotFound();

        await _unitOfWork.StockMovements.DeleteAsync(stockMovement);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}