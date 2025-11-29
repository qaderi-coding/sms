using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class CreatePurchaseHandler : IRequestHandler<CreatePurchaseCommand, PurchaseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFinancialService _financialService;

    public CreatePurchaseHandler(IUnitOfWork unitOfWork, IFinancialService financialService)
    {
        _unitOfWork = unitOfWork;
        _financialService = financialService;
    }

    public async Task<PurchaseDto> Handle(CreatePurchaseCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Validate supplier
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(request.Purchase.SupplierId);
            if (supplier == null)
                throw new ArgumentException($"Supplier with ID '{request.Purchase.SupplierId}' not found");

            // Calculate amounts
            var totalAmount = request.Purchase.Items.Sum(i => i.Total);
            var creditAmount = totalAmount - request.Purchase.CashPaid;

            // Create purchase or return
            var purchase = new Purchase
            {
                SupplierId = request.Purchase.SupplierId,
                Date = request.Purchase.Date,
                TotalAmount = request.IsReturn ? -totalAmount : totalAmount, // Negative for returns
                CashPaid = request.IsReturn ? -request.Purchase.CashPaid : request.Purchase.CashPaid,
                CreditAmount = request.IsReturn ? -creditAmount : creditAmount,
                CurrencyId = request.Purchase.CurrencyId,
                IsReturn = request.IsReturn,
                Notes = request.Purchase.Notes
            };

            // Add purchase items (negative quantities for returns)
            foreach (var itemDto in request.Purchase.Items)
            {
                purchase.Items.Add(new PurchaseItem
                {
                    ItemId = itemDto.ItemId,
                    Qty = request.IsReturn ? -itemDto.Qty : itemDto.Qty,
                    Cost = itemDto.Cost,
                    Total = request.IsReturn ? -itemDto.Total : itemDto.Total
                });
            }

            var createdPurchase = await _unitOfWork.Purchases.AddAsync(purchase);
            await _unitOfWork.SaveChangesAsync();

            // Record financial transactions
            if (request.Purchase.CashPaid > 0)
            {
                var currency = await _unitOfWork.Currencies.GetByIdAsync(request.Purchase.CurrencyId);
                var exchangeRate = currency?.CurrentExchangeRate ?? 1.0m;
                var amountInBaseCurrency = request.Purchase.CashPaid * exchangeRate;
                
                if (request.IsReturn)
                {
                    // For returns: cash in (refund received)
                    await _financialService.RecordCashTransactionAsync(
                        request.Purchase.Date,
                        ModuleType.PurchaseReturn,
                        createdPurchase.Id,
                        $"Cash received for purchase return #{createdPurchase.Id}",
                        request.Purchase.CurrencyId,
                        request.Purchase.CashPaid,
                        exchangeRate,
                        amountInBaseCurrency,
                        0
                    );
                }
                else
                {
                    // For purchases: cash out
                    await _financialService.RecordCashTransactionAsync(
                        request.Purchase.Date,
                        ModuleType.Purchase,
                        createdPurchase.Id,
                        $"Cash paid for purchase #{createdPurchase.Id}",
                        request.Purchase.CurrencyId,
                        request.Purchase.CashPaid,
                        exchangeRate,
                        0,
                        amountInBaseCurrency
                    );
                }
            }

            if (creditAmount != 0)
            {
                if (request.IsReturn)
                {
                    // For returns: increase supplier balance (credit received)
                    await _financialService.RecordSupplierTransactionAsync(
                        supplier.Id,
                        request.Purchase.Date,
                        $"Purchase return #{createdPurchase.Id}",
                        null,
                        createdPurchase.Id,
                        0,
                        Math.Abs(creditAmount)
                    );
                }
                else
                {
                    // For purchases: increase supplier balance (credit purchase)
                    await _financialService.RecordSupplierTransactionAsync(
                        supplier.Id,
                        request.Purchase.Date,
                        $"Purchase #{createdPurchase.Id}",
                        createdPurchase.Id,
                        null,
                        creditAmount,
                        0
                    );
                }
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return await MapToPurchaseDtoAsync(createdPurchase, supplier);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<PurchaseDto> MapToPurchaseDtoAsync(Purchase purchase, Supplier supplier)
    {
        var currency = await _unitOfWork.Currencies.GetByIdAsync(purchase.CurrencyId);
        var items = await _unitOfWork.Items.GetAllAsync();
        
        return new PurchaseDto
        {
            Id = purchase.Id,
            SupplierId = purchase.SupplierId,
            SupplierName = supplier.Name,
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