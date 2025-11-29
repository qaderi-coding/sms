using MediatR;
using ShopManagementSystem.Application.DTOs;

namespace ShopManagementSystem.Application.Commands;

public class CreatePurchaseCommand : IRequest<PurchaseDto>
{
    public CreatePurchaseDto Purchase { get; set; } = null!;
    public bool IsReturn { get; set; } = false;
}