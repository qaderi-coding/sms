using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/parties/customers")]
[SwaggerTag("Customer management endpoints")]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all customers",
        Description = "Retrieves a list of all customers"
    )]
    [SwaggerResponse(200, "Customers retrieved successfully", typeof(IEnumerable<CustomerResponse>))]
    public async Task<ActionResult<IEnumerable<CustomerResponse>>> GetCustomers()
    {
        var customers = await _mediator.Send(new GetCustomersQuery());
        return Ok(customers);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(
        Summary = "Get customer by ID",
        Description = "Retrieves a specific customer by ID"
    )]
    [SwaggerResponse(200, "Customer found", typeof(CustomerResponse))]
    [SwaggerResponse(404, "Customer not found")]
    public async Task<ActionResult<CustomerResponse>> GetCustomer(
        [SwaggerParameter("The ID of the customer to retrieve")] int id)
    {
        var customer = await _mediator.Send(new GetCustomerByIdQuery { Id = id });
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Create customer",
        Description = "Creates a new customer"
    )]
    [SwaggerResponse(201, "Customer created successfully", typeof(CustomerResponse))]
    [SwaggerResponse(400, "Invalid customer data")]
    public async Task<ActionResult<CustomerResponse>> CreateCustomer(
        [FromBody, SwaggerParameter("Customer data")] CreateCustomerRequest request)
    {
        var command = new CreateCustomerCommand { Request = request };
        var createdCustomer = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCustomer), new { id = createdCustomer.Id }, createdCustomer);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(
        Summary = "Update customer",
        Description = "Updates an existing customer"
    )]
    [SwaggerResponse(200, "Customer updated successfully", typeof(CustomerResponse))]
    [SwaggerResponse(404, "Customer not found")]
    public async Task<ActionResult<CustomerResponse>> UpdateCustomer(
        [SwaggerParameter("Customer ID")] int id,
        [FromBody, SwaggerParameter("Updated customer data")] UpdateCustomerRequest request)
    {
        try
        {
            var command = new UpdateCustomerCommand { Id = id, Request = request };
            var updatedCustomer = await _mediator.Send(command);
            return Ok(updatedCustomer);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(
        Summary = "Delete customer",
        Description = "Deletes a customer"
    )]
    [SwaggerResponse(204, "Customer deleted successfully")]
    [SwaggerResponse(404, "Customer not found")]
    public async Task<ActionResult> DeleteCustomer(
        [SwaggerParameter("Customer ID")] int id)
    {
        var result = await _mediator.Send(new DeleteCustomerCommand { Id = id });
        if (!result) return NotFound();
        return NoContent();
    }
}