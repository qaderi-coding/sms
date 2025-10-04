using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/categories")]
[SwaggerTag("Category management endpoints")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all categories")]
    [SwaggerResponse(200, "Categories retrieved successfully", typeof(IEnumerable<CategoryResponse>))]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetCategories()
    {
        var categories = await _mediator.Send(new GetCategoriesQuery());
        return Ok(categories);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get category by ID")]
    [SwaggerResponse(200, "Category found", typeof(CategoryResponse))]
    [SwaggerResponse(404, "Category not found")]
    public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
    {
        var category = await _mediator.Send(new GetCategoryByIdQuery { Id = id });
        if (category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create category")]
    [SwaggerResponse(201, "Category created successfully", typeof(CategoryResponse))]
    [Authorize(Policy = "ManagerOrAdmin")]
    public async Task<ActionResult<CategoryResponse>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var command = new CreateCategoryCommand { Request = request };
        var createdCategory = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCategory), new { id = createdCategory.Id }, createdCategory);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update category")]
    [SwaggerResponse(200, "Category updated successfully", typeof(CategoryResponse))]
    [SwaggerResponse(404, "Category not found")]
    [Authorize(Policy = "ManagerOrAdmin")]
    public async Task<ActionResult<CategoryResponse>> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        try
        {
            var command = new UpdateCategoryCommand { Id = id, Request = request };
            var updatedCategory = await _mediator.Send(command);
            return Ok(updatedCategory);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete category")]
    [SwaggerResponse(204, "Category deleted successfully")]
    [SwaggerResponse(404, "Category not found")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}