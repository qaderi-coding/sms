using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Commands;

public class UpdateSaleCommand : IRequest<SaleDto>
{
    public int Id { get; set; }
    public CreateSaleDto Sale { get; set; } = null!;
}