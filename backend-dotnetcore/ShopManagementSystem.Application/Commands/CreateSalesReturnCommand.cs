using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Commands;

public class CreateSalesReturnCommand : IRequest<SalesReturnDto>
{
    public CreateSalesReturnDto SalesReturn { get; set; } = null!;
}