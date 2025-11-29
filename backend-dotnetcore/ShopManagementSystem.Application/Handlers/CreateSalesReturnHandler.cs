using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class CreateSalesReturnHandler : IRequestHandler<CreateSalesReturnCommand, SalesReturnDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFinancialService _financialService;

    public CreateSalesReturnHandler(IUnitOfWork unitOfWork, IFinancialService financialService)
    {
        _unitOfWork = unitOfWork;
        _financialService = financialService;
    }

    public async Task<SalesReturnDto> Handle(CreateSalesReturnCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Validate customer
            var customer = await _unitOfWork.Customers.GetByIdAsync(request.SalesReturn.CustomerId);
            if (customer == null)
                throw new ArgumentException($"Customer with ID '{request.SalesReturn.CustomerId}' not found");

            // Calculate amounts
            var totalReturnAmount = request.SalesReturn.Items.Sum(i => i.Total);
            var creditRefund = totalReturnAmount - request.SalesReturn.CashRefund;

            // Create sales return
            var salesReturn = new SalesReturn
            {
                CustomerId = request.SalesReturn.CustomerId,
                Date = request.SalesReturn.Date,
                TotalReturnAmount = totalReturnAmount,
                CashRefund = request.SalesReturn.CashRefund,
                CreditRefund = creditRefund,
                CurrencyId = request.SalesReturn.CurrencyId,
                Notes = request.SalesReturn.Notes
            };

            // Add return items
            foreach (var itemDto in request.SalesReturn.Items)
            {
                salesReturn.Items.Add(new SaleReturnItem
                {
                    ItemId = itemDto.ItemId,
                    Qty = itemDto.Qty,
                    Price = itemDto.Price,
                    Total = itemDto.Total
                });
            }

            var createdReturn = await _unitOfWork.SalesReturns.AddAsync(salesReturn);
            await _unitOfWork.SaveChangesAsync();

            // Record financial transactions
            if (request.SalesReturn.CashRefund > 0)
            {
                var currency = await _unitOfWork.Currencies.GetByIdAsync(request.SalesReturn.CurrencyId);
                var exchangeRate = currency?.CurrentExchangeRate ?? 1.0m;
                var amountInBaseCurrency = request.SalesReturn.CashRefund * exchangeRate;
                
                await _financialService.RecordCashTransactionAsync(
                    request.SalesReturn.Date,
                    ModuleType.SaleReturn,
                    createdReturn.Id,
                    $"Cash refund for sales return #{createdReturn.Id}",
                    request.SalesReturn.CurrencyId,
                    request.SalesReturn.CashRefund,
                    exchangeRate,
                    0, // Cash in
                    amountInBaseCurrency // Cash out
                );
            }

            if (creditRefund > 0)
            {
                await _financialService.RecordCustomerTransactionAsync(
                    customer.Id,
                    request.SalesReturn.Date,
                    $"Sales return #{createdReturn.Id}",
                    null,
                    null,
                    0, // Credit amount
                    creditRefund // Payment amount (reduces customer balance)
                );
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return await MapToSalesReturnDtoAsync(createdReturn, customer);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task<SalesReturnDto> MapToSalesReturnDtoAsync(SalesReturn salesReturn, Customer customer)
    {
        var currency = await _unitOfWork.Currencies.GetByIdAsync(salesReturn.CurrencyId);
        var items = await _unitOfWork.Items.GetAllAsync();
        
        return new SalesReturnDto
        {
            Id = salesReturn.Id,
            CustomerId = salesReturn.CustomerId,
            CustomerName = customer.Name,
            Date = salesReturn.Date,
            TotalReturnAmount = salesReturn.TotalReturnAmount,
            CashRefund = salesReturn.CashRefund,
            CreditRefund = salesReturn.CreditRefund,
            CurrencyId = salesReturn.CurrencyId,
            Currency = currency?.Code ?? "",
            CurrencySymbol = currency?.Symbol ?? "",
            Notes = salesReturn.Notes,
            Items = salesReturn.Items.Select(i => new SaleReturnItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                ItemName = items.FirstOrDefault(item => item.Id == i.ItemId)?.Name ?? "",
                Qty = i.Qty,
                Price = i.Price,
                Total = i.Total
            }).ToList()
        };
    }
}