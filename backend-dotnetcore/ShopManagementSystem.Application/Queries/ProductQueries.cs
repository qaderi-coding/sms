using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetProductsQuery : IRequest<IEnumerable<ProductResponse>>
{
}

public class GetProductByIdQuery : IRequest<ProductResponse?>
{
    public int Id { get; set; }
}