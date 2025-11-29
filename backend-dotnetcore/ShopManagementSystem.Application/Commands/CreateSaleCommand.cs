using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Commands;

public class CreateSaleCommand : IRequest<SaleDto>
{
    public CreateSaleDto Sale { get; set; } = null!;
    public bool IsReturn { get; set; } = false;
}