using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/product-unit-conversions")]
[SwaggerTag("Product unit conversion endpoints")]
public class ProductUnitConversionsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductUnitConversionsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all product unit conversions")]
    public async Task<ActionResult<IEnumerable<ProductUnitConversion>>> GetProductUnitConversions()
    {
        var conversions = await _unitOfWork.ProductUnitConversions.GetAllAsync();
        return Ok(conversions);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get product unit conversion by ID")]
    public async Task<ActionResult<ProductUnitConversion>> GetProductUnitConversion(int id)
    {
        var conversion = await _unitOfWork.ProductUnitConversions.GetByIdAsync(id);
        if (conversion == null) return NotFound();
        return Ok(conversion);
    }

    [HttpGet("by-product/{productId}")]
    [SwaggerOperation(Summary = "Get unit conversions by product")]
    public async Task<ActionResult<IEnumerable<ProductUnitConversion>>> GetConversionsByProduct(int productId)
    {
        var conversions = await _unitOfWork.ProductUnitConversions.FindAsync(c => c.ProductId == productId);
        return Ok(conversions);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create product unit conversion")]
    public async Task<ActionResult<ProductUnitConversion>> CreateProductUnitConversion([FromBody] ProductUnitConversion conversion)
    {
        var createdConversion = await _unitOfWork.ProductUnitConversions.AddAsync(conversion);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProductUnitConversion), new { id = createdConversion.Id }, createdConversion);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update product unit conversion")]
    public async Task<ActionResult<ProductUnitConversion>> UpdateProductUnitConversion(int id, [FromBody] ProductUnitConversion conversion)
    {
        var existingConversion = await _unitOfWork.ProductUnitConversions.GetByIdAsync(id);
        if (existingConversion == null) return NotFound();

        existingConversion.ProductId = conversion.ProductId;
        existingConversion.UnitId = conversion.UnitId;
        existingConversion.Factor = conversion.Factor;
        existingConversion.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.ProductUnitConversions.UpdateAsync(existingConversion);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingConversion);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete product unit conversion")]
    public async Task<ActionResult> DeleteProductUnitConversion(int id)
    {
        var conversion = await _unitOfWork.ProductUnitConversions.GetByIdAsync(id);
        if (conversion == null) return NotFound();

        await _unitOfWork.ProductUnitConversions.DeleteAsync(conversion);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}