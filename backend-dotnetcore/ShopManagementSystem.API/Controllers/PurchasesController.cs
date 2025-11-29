using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/purchases")]
[SwaggerTag("Purchases and returns management endpoints")]
public class PurchasesController : ControllerBase
{
    private readonly IMediator _mediator;

    public PurchasesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get purchases or returns",
        Description = "Retrieves purchases or returns based on query parameter"
    )]
    [SwaggerResponse(200, "Purchases retrieved successfully", typeof(IEnumerable<PurchaseDto>))]
    public async Task<ActionResult<IEnumerable<PurchaseDto>>> GetPurchases([FromQuery] bool? isReturn = null)
    {
        var purchases = await _mediator.Send(new GetPurchasesQuery { IsReturn = isReturn });
        return Ok(purchases);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Get purchase by ID",
        Description = "Retrieves a specific purchase by its ID"
    )]
    [SwaggerResponse(200, "Purchase found", typeof(PurchaseDto))]
    [SwaggerResponse(404, "Purchase not found")]
    public async Task<ActionResult<PurchaseDto>> GetPurchase(
        [SwaggerParameter("The ID of the purchase to retrieve")] int id)
    {
        var purchase = await _mediator.Send(new GetPurchaseByIdQuery { Id = id });
        if (purchase == null)
            return NotFound();
        
        return Ok(purchase);
    }

    [HttpPost("bulk-create")]
    [SwaggerOperation(
        Summary = "Create bulk purchase",
        Description = "Creates a new purchase with multiple items and proper cashbook transactions"
    )]
    [SwaggerResponse(201, "Purchase created successfully", typeof(PurchaseDto))]
    [SwaggerResponse(400, "Invalid purchase data")]
    public async Task<ActionResult<PurchaseDto>> CreateBulkPurchase(
        [FromBody, SwaggerParameter("Purchase data including supplier and items")] CreatePurchaseDto createPurchaseDto)
    {
        var command = new CreatePurchaseCommand { Purchase = createPurchaseDto };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPurchase), new { id = result.Id }, result);
    }

    [HttpPost("returns/bulk-create")]
    [SwaggerOperation(
        Summary = "Create bulk purchase return",
        Description = "Creates a new purchase return using the same Purchase entity with IsReturn=true"
    )]
    [SwaggerResponse(201, "Purchase return created successfully", typeof(PurchaseDto))]
    [SwaggerResponse(400, "Invalid purchase return data")]
    public async Task<ActionResult<PurchaseDto>> CreateBulkPurchaseReturn(
        [FromBody, SwaggerParameter("Purchase return data")] CreatePurchaseDto createPurchaseDto)
    {
        var command = new CreatePurchaseCommand { Purchase = createPurchaseDto, IsReturn = true };
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetPurchase), new { id = result.Id }, result);
    }
}