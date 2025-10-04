using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateCustomerCommand : IRequest<CustomerResponse>
{
    public CreateCustomerRequest Request { get; set; } = null!;
}

public class UpdateCustomerCommand : IRequest<CustomerResponse>
{
    public int Id { get; set; }
    public UpdateCustomerRequest Request { get; set; } = null!;
}

public class DeleteCustomerCommand : IRequest<bool>
{
    public int Id { get; set; }
}