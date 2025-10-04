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
        var createdProductItem = await _unitOfWork.ProductItems.AddAsync(productItem);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProductItem), new { id = createdProductItem.Id }, createdProductItem);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update product item")]
    public async Task<ActionResult<ProductItem>> UpdateProductItem(int id, [FromBody] ProductItem productItem)
    {
        var existingProductItem = await _unitOfWork.ProductItems.GetByIdAsync(id);
        if (existingProductItem == null) return NotFound();

        existingProductItem.ProductId = productItem.ProductId;
        existingProductItem.PurchasePrice = productItem.PurchasePrice;
        existingProductItem.Currency = productItem.Currency;
        existingProductItem.ExchangeRateToUsd = productItem.ExchangeRateToUsd;
        existingProductItem.Quantity = productItem.Quantity;
        existingProductItem.UpdatedAt = DateTime.UtcNow;

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