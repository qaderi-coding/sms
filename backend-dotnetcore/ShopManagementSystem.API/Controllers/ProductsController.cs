using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/products")]
[SwaggerTag("Product management endpoints")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all products",
        Description = "Retrieves a list of all products with their categories"
    )]
    [SwaggerResponse(200, "Products retrieved successfully", typeof(IEnumerable<ProductResponse>))]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts()
    {
        var products = await _mediator.Send(new GetProductsQuery());
        return Ok(products);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Get product by ID",
        Description = "Retrieves a specific product by ID"
    )]
    [SwaggerResponse(200, "Product found", typeof(ProductResponse))]
    [SwaggerResponse(404, "Product not found")]
    public async Task<ActionResult<ProductResponse>> GetProduct(
        [SwaggerParameter("The ID of the product to retrieve")] int id)
    {
        var product = await _mediator.Send(new GetProductByIdQuery { Id = id });
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Create product",
        Description = "Creates a new product"
    )]
    [SwaggerResponse(201, "Product created successfully", typeof(ProductResponse))]
    [SwaggerResponse(400, "Invalid product data")]
    public async Task<ActionResult<ProductResponse>> CreateProduct(
        [FromBody, SwaggerParameter("Product data")] CreateProductRequest request)
    {
        var command = new CreateProductCommand { Request = request };
        var createdProduct = await _mediator.Send(command);
        
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Update product",
        Description = "Updates an existing product"
    )]
    [SwaggerResponse(200, "Product updated successfully", typeof(ProductResponse))]
    [SwaggerResponse(404, "Product not found")]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(
        [SwaggerParameter("Product ID")] int id,
        [FromBody, SwaggerParameter("Updated product data")] UpdateProductRequest request)
    {
        try
        {
            var command = new UpdateProductCommand { Id = id, Request = request };
            var updatedProduct = await _mediator.Send(command);
            return Ok(updatedProduct);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Delete product",
        Description = "Deletes a product"
    )]
    [SwaggerResponse(204, "Product deleted successfully")]
    [SwaggerResponse(404, "Product not found")]
    public async Task<ActionResult> DeleteProduct(
        [SwaggerParameter("Product ID")] int id)
    {
        var result = await _mediator.Send(new DeleteProductCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}