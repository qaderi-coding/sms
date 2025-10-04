using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetSuppliersQuery : IRequest<IEnumerable<SupplierResponse>>
{
}

public class GetSupplierByIdQuery : IRequest<SupplierResponse?>
{
    public int Id { get; set; }
}