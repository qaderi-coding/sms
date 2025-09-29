using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/inventory/companies")]
[SwaggerTag("Company management endpoints")]
public class CompaniesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CompaniesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all companies")]
    [SwaggerResponse(200, "Companies retrieved successfully", typeof(IEnumerable<CompanyResponse>))]
    public async Task<ActionResult<IEnumerable<CompanyResponse>>> GetCompanies()
    {
        var companies = await _mediator.Send(new GetCompaniesQuery());
        return Ok(companies);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get company by ID")]
    [SwaggerResponse(200, "Company found", typeof(CompanyResponse))]
    [SwaggerResponse(404, "Company not found")]
    public async Task<ActionResult<CompanyResponse>> GetCompany(int id)
    {
        var company = await _mediator.Send(new GetCompanyByIdQuery { Id = id });
        if (company == null) return NotFound();
        return Ok(company);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create company")]
    [SwaggerResponse(201, "Company created successfully", typeof(CompanyResponse))]
    public async Task<ActionResult<CompanyResponse>> CreateCompany([FromBody] CreateCompanyRequest request)
    {
        var command = new CreateCompanyCommand { Request = request };
        var createdCompany = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCompany), new { id = createdCompany.Id }, createdCompany);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update company")]
    [SwaggerResponse(200, "Company updated successfully", typeof(CompanyResponse))]
    [SwaggerResponse(404, "Company not found")]
    public async Task<ActionResult<CompanyResponse>> UpdateCompany(int id, [FromBody] UpdateCompanyRequest request)
    {
        try
        {
            var command = new UpdateCompanyCommand { Id = id, Request = request };
            var updatedCompany = await _mediator.Send(command);
            return Ok(updatedCompany);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete company")]
    [SwaggerResponse(204, "Company deleted successfully")]
    [SwaggerResponse(404, "Company not found")]
    public async Task<ActionResult> DeleteCompany(int id)
    {
        var result = await _mediator.Send(new DeleteCompanyCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}