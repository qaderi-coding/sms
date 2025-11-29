using MediatR;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetPurchasesQueryHandler : IRequestHandler<GetPurchasesQuery, IEnumerable<PurchaseDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetPurchasesQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<PurchaseDto>> Handle(GetPurchasesQuery request, CancellationToken cancellationToken)
    {
        var purchases = await _unitOfWork.Purchases.GetAllAsync();
        
        // Filter by IsReturn if specified
        if (request.IsReturn.HasValue)
        {
            purchases = purchases.Where(p => p.IsReturn == request.IsReturn.Value);
        }
        
        var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
        var items = await _unitOfWork.Items.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();

        return purchases.Select(p => new PurchaseDto
        {
            Id = p.Id,
            SupplierId = p.SupplierId,
            SupplierName = suppliers.FirstOrDefault(s => s.Id == p.SupplierId)?.Name ?? "",
            Date = p.Date,
            TotalAmount = p.TotalAmount,
            CashPaid = p.CashPaid,
            CreditAmount = p.CreditAmount,
            CurrencyId = p.CurrencyId,
            Currency = currencies.FirstOrDefault(c => c.Id == p.CurrencyId)?.Code ?? "",
            CurrencySymbol = currencies.FirstOrDefault(c => c.Id == p.CurrencyId)?.Symbol ?? "",
            Notes = p.Notes,
            Items = p.Items.Select(i => new PurchaseItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                ItemName = items.FirstOrDefault(item => item.Id == i.ItemId)?.Name ?? "",
                Qty = i.Qty,
                Cost = i.Cost,
                Total = i.Total
            }).ToList()
        });
    }
}

public class GetPurchaseByIdQueryHandler : IRequestHandler<GetPurchaseByIdQuery, PurchaseDto?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetPurchaseByIdQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PurchaseDto?> Handle(GetPurchaseByIdQuery request, CancellationToken cancellationToken)
    {
        var purchase = await _unitOfWork.Purchases.GetByIdAsync(request.Id);
        if (purchase == null) return null;

        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(purchase.SupplierId);
        var items = await _unitOfWork.Items.GetAllAsync();
        var currency = await _unitOfWork.Currencies.GetByIdAsync(purchase.CurrencyId);

        return new PurchaseDto
        {
            Id = purchase.Id,
            SupplierId = purchase.SupplierId,
            SupplierName = supplier?.Name ?? "",
            Date = purchase.Date,
            TotalAmount = purchase.TotalAmount,
            CashPaid = purchase.CashPaid,
            CreditAmount = purchase.CreditAmount,
            CurrencyId = purchase.CurrencyId,
            Currency = currency?.Code ?? "",
            CurrencySymbol = currency?.Symbol ?? "",
            Notes = purchase.Notes,
            Items = purchase.Items.Select(i => new PurchaseItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                ItemName = items.FirstOrDefault(item => item.Id == i.ItemId)?.Name ?? "",
                Qty = i.Qty,
                Cost = i.Cost,
                Total = i.Total
            }).ToList()
        };
    }
}