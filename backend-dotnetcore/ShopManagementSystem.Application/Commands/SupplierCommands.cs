using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateSupplierCommand : IRequest<SupplierResponse>
{
    public CreateSupplierRequest Request { get; set; } = null!;
}

public class UpdateSupplierCommand : IRequest<SupplierResponse>
{
    public int Id { get; set; }
    public UpdateSupplierRequest Request { get; set; } = null!;
}

public class DeleteSupplierCommand : IRequest<bool>
{
    public int Id { get; set; }
}