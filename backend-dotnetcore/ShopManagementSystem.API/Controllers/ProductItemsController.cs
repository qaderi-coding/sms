using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/product-items")]
[SwaggerTag("Product item management endpoints")]
public class ProductItemsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductItemsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all product items")]
    public async Task<ActionResult<IEnumerable<ProductItem>>> GetProductItems()
    {
        var productItems = await _unitOfWork.ProductItems.GetAllAsync();
        return Ok(productItems);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get product item by ID")]
    public async Task<ActionResult<ProductItem>> GetProductItem(int id)
    {
        var productItem = await _unitOfWork.ProductItems.GetByIdAsync(id);
        if (productItem == null) return NotFound();
        return Ok(productItem);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create product item")]
    public async Task<ActionResult<ProductItem>> CreateProductItem([FromBody] ProductItem productItem)
    {
        // Set audit fields for new entity
        productItem.Id = 0; // Ensure new entity
        productItem.CreatedAt = DateTime.UtcNow;
        productItem.UpdatedAt = DateTime.UtcNow;
        
        var createdProductItem = await _unitOfWork.ProductItems.AddAsync(productItem);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProductItem), new { id = createdProductItem.Id }, createdProductItem);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update product item")]
    public async Task<ActionResult<ProductItem>> UpdateProductItem(int id, [FromBody] ProductItem productItem)
    {
        if (id != productItem.Id) return BadRequest("ID mismatch");
        
        var existingProductItem = await _unitOfWork.ProductItems.GetByIdAsync(id);
        if (existingProductItem == null) return NotFound();

        // Update only the allowed fields, preserve audit fields
        existingProductItem.ProductId = productItem.ProductId;
        existingProductItem.PurchasePrice = productItem.PurchasePrice;
        existingProductItem.Currency = productItem.Currency ?? string.Empty;
        existingProductItem.ExchangeRateToUsd = productItem.ExchangeRateToUsd;
        existingProductItem.Quantity = productItem.Quantity;
        existingProductItem.UpdatedAt = DateTime.UtcNow;
        // Preserve CreatedAt from existing entity

        await _unitOfWork.ProductItems.UpdateAsync(existingProductItem);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingProductItem);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete product item")]
    public async Task<ActionResult> DeleteProductItem(int id)
    {
        var productItem = await _unitOfWork.ProductItems.GetByIdAsync(id);
        if (productItem == null) return NotFound();

        await _unitOfWork.ProductItems.DeleteAsync(productItem);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}