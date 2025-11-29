using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Queries;

public class GetSalesReturnsQuery : IRequest<IEnumerable<SalesReturnDto>>
{
}

public class GetSalesReturnByIdQuery : IRequest<SalesReturnDto?>
{
    public int Id { get; set; }
}