using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateCategoryCommand : IRequest<CategoryResponse>
{
    public CreateCategoryRequest Request { get; set; } = null!;
}

public class UpdateCategoryCommand : IRequest<CategoryResponse>
{
    public int Id { get; set; }
    public UpdateCategoryRequest Request { get; set; } = null!;
}

public class DeleteCategoryCommand : IRequest<bool>
{
    public int Id { get; set; }
}