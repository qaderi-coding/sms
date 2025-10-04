using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Queries;

public class GetSalesQuery : IRequest<IEnumerable<SaleDto>>
{
}

public class GetSaleByIdQuery : IRequest<SaleDto?>
{
    public int Id { get; set; }
}