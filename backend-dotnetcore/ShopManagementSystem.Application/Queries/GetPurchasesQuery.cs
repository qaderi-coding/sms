using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Queries;

public class GetPurchasesQuery : IRequest<IEnumerable<PurchaseDto>>
{
    public bool? IsReturn { get; set; } = null; // null = all, true = returns only, false = purchases only
}

public class GetPurchaseByIdQuery : IRequest<PurchaseDto?>
{
    public int Id { get; set; }
}