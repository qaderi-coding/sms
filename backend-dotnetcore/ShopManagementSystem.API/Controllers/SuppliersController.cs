using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/parties/suppliers")]
[SwaggerTag("Supplier management endpoints")]
public class SuppliersController : ControllerBase
{
    private readonly IMediator _mediator;

    public SuppliersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all suppliers",
        Description = "Retrieves a list of all suppliers"
    )]
    [SwaggerResponse(200, "Suppliers retrieved successfully", typeof(IEnumerable<SupplierResponse>))]
    public async Task<ActionResult<IEnumerable<SupplierResponse>>> GetSuppliers()
    {
        var suppliers = await _mediator.Send(new GetSuppliersQuery());
        return Ok(suppliers);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Get supplier by ID",
        Description = "Retrieves a specific supplier by ID"
    )]
    [SwaggerResponse(200, "Supplier found", typeof(SupplierResponse))]
    [SwaggerResponse(404, "Supplier not found")]
    public async Task<ActionResult<SupplierResponse>> GetSupplier(int id)
    {
        var supplier = await _mediator.Send(new GetSupplierByIdQuery { Id = id });
        if (supplier == null)
            return NotFound();

        return Ok(supplier);
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Create supplier",
        Description = "Creates a new supplier"
    )]
    [SwaggerResponse(201, "Supplier created successfully", typeof(SupplierResponse))]
    public async Task<ActionResult<SupplierResponse>> CreateSupplier(
        [FromBody, SwaggerParameter("Supplier data")] CreateSupplierRequest request)
    {
        var command = new CreateSupplierCommand { Request = request };
        var createdSupplier = await _mediator.Send(command);
        
        return CreatedAtAction(nameof(GetSupplier), new { id = createdSupplier.Id }, createdSupplier);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Update supplier",
        Description = "Updates an existing supplier"
    )]
    [SwaggerResponse(200, "Supplier updated successfully", typeof(SupplierResponse))]
    [SwaggerResponse(404, "Supplier not found")]
    public async Task<ActionResult<SupplierResponse>> UpdateSupplier(
        [SwaggerParameter("Supplier ID")] int id,
        [FromBody, SwaggerParameter("Updated supplier data")] UpdateSupplierRequest request)
    {
        try
        {
            var command = new UpdateSupplierCommand { Id = id, Request = request };
            var updatedSupplier = await _mediator.Send(command);
            return Ok(updatedSupplier);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Delete supplier",
        Description = "Deletes a supplier"
    )]
    [SwaggerResponse(204, "Supplier deleted successfully")]
    [SwaggerResponse(404, "Supplier not found")]
    public async Task<ActionResult> DeleteSupplier(
        [SwaggerParameter("Supplier ID")] int id)
    {
        var result = await _mediator.Send(new DeleteSupplierCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}