using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/sales")]
[SwaggerTag("Sales management endpoints")]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all sales",
        Description = "Retrieves a list of all sales in the system"
    )]
    [SwaggerResponse(200, "Sales retrieved successfully", typeof(IEnumerable<SaleDto>))]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
    {
        var sales = await _mediator.Send(new GetSalesQuery());
        return Ok(sales);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Get sale by ID",
        Description = "Retrieves a specific sale by its ID"
    )]
    [SwaggerResponse(200, "Sale found", typeof(SaleDto))]
    [SwaggerResponse(404, "Sale not found")]
    public async Task<ActionResult<SaleDto>> GetSale(
        [SwaggerParameter("The ID of the sale to retrieve")] int id)
    {
        var sale = await _mediator.Send(new GetSaleByIdQuery { Id = id });
        if (sale == null)
            return NotFound();
        
        return Ok(sale);
    }

    [HttpPost("bulk-create")]
    [SwaggerOperation(
        Summary = "Create bulk sale",
        Description = "Creates a new sale with multiple items in a single transaction"
    )]
    [SwaggerResponse(201, "Sale created successfully", typeof(SaleDto))]
    [SwaggerResponse(400, "Invalid sale data")]
    public async Task<ActionResult<SaleDto>> CreateBulkSale(
        [FromBody, SwaggerParameter("Sale data including customer and items")] CreateSaleDto createSaleDto)
    {
        var command = new CreateSaleCommand { Sale = createSaleDto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetSale), new { id = result.Id }, result);
    }

    [HttpPut("bulk-update/{id}")]
    [SwaggerOperation(
        Summary = "Update bulk sale",
        Description = "Updates an existing sale with multiple items"
    )]
    [SwaggerResponse(200, "Sale updated successfully", typeof(SaleDto))]
    [SwaggerResponse(404, "Sale not found")]
    public async Task<ActionResult<SaleDto>> UpdateBulkSale(
        [SwaggerParameter("Sale ID")] int id,
        [FromBody, SwaggerParameter("Updated sale data")] CreateSaleDto updateSaleDto)
    {
        var existingSale = await _mediator.Send(new GetSaleByIdQuery { Id = id });
        if (existingSale == null)
            return NotFound();

        var command = new UpdateSaleCommand { Id = id, Sale = updateSaleDto };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("returns/bulk-create")]
    [SwaggerOperation(
        Summary = "Create bulk sale return",
        Description = "Creates a sale return with multiple items"
    )]
    [SwaggerResponse(201, "Sale return created successfully", typeof(SaleDto))]
    public async Task<ActionResult<SaleDto>> CreateBulkSaleReturn(
        [FromBody, SwaggerParameter("Sale return data")] CreateSaleDto createSaleDto)
    {
        var command = new CreateSaleCommand { Sale = createSaleDto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetSale), new { id = result.Id }, result);
    }
}