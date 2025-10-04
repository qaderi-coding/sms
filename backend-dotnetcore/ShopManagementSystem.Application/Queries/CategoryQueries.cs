using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetCategoriesQuery : IRequest<IEnumerable<CategoryResponse>>
{
}

public class GetCategoryByIdQuery : IRequest<CategoryResponse?>
{
    public int Id { get; set; }
}