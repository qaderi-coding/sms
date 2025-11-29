using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Queries;

public class GetSalesQuery : IRequest<IEnumerable<SaleDto>>
{
    public bool? IsReturn { get; set; } = null; // null = all, true = returns only, false = sales only
}

public class GetSaleByIdQuery : IRequest<SaleDto?>
{
    public int Id { get; set; }
}