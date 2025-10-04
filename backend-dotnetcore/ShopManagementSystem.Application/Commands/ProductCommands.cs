using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateProductCommand : IRequest<ProductResponse>
{
    public CreateProductRequest Request { get; set; } = null!;
}

public class UpdateProductCommand : IRequest<ProductResponse>
{
    public int Id { get; set; }
    public UpdateProductRequest Request { get; set; } = null!;
}

public class DeleteProductCommand : IRequest<bool>
{
    public int Id { get; set; }
}