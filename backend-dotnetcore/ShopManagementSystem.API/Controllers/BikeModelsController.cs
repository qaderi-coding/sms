using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/bike-models")]
[SwaggerTag("Bike model management endpoints")]
public class BikeModelsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BikeModelsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all bike models")]
    [SwaggerResponse(200, "Bike models retrieved successfully", typeof(IEnumerable<BikeModelResponse>))]
    public async Task<ActionResult<IEnumerable<BikeModelResponse>>> GetBikeModels()
    {
        var bikeModels = await _mediator.Send(new GetBikeModelsQuery());
        return Ok(bikeModels);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get bike model by ID")]
    [SwaggerResponse(200, "Bike model found", typeof(BikeModelResponse))]
    [SwaggerResponse(404, "Bike model not found")]
    public async Task<ActionResult<BikeModelResponse>> GetBikeModel(int id)
    {
        var bikeModel = await _mediator.Send(new GetBikeModelByIdQuery { Id = id });
        if (bikeModel == null) return NotFound();
        return Ok(bikeModel);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create bike model")]
    [SwaggerResponse(201, "Bike model created successfully", typeof(BikeModelResponse))]
    public async Task<ActionResult<BikeModelResponse>> CreateBikeModel([FromBody] CreateBikeModelRequest request)
    {
        var command = new CreateBikeModelCommand { Request = request };
        var createdBikeModel = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetBikeModel), new { id = createdBikeModel.Id }, createdBikeModel);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update bike model")]
    [SwaggerResponse(200, "Bike model updated successfully", typeof(BikeModelResponse))]
    [SwaggerResponse(404, "Bike model not found")]
    public async Task<ActionResult<BikeModelResponse>> UpdateBikeModel(int id, [FromBody] UpdateBikeModelRequest request)
    {
        try
        {
            var command = new UpdateBikeModelCommand { Id = id, Request = request };
            var updatedBikeModel = await _mediator.Send(command);
            return Ok(updatedBikeModel);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete bike model")]
    [SwaggerResponse(204, "Bike model deleted successfully")]
    [SwaggerResponse(404, "Bike model not found")]
    public async Task<ActionResult> DeleteBikeModel(int id)
    {
        var result = await _mediator.Send(new DeleteBikeModelCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}