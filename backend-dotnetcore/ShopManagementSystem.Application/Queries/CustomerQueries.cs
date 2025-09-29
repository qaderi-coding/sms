using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetCustomersQuery : IRequest<IEnumerable<CustomerResponse>>
{
}

public class GetCustomerByIdQuery : IRequest<CustomerResponse?>
{
    public int Id { get; set; }
}