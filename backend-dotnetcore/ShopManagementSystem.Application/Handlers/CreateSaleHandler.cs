using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class CreateSaleHandler : IRequestHandler<CreateSaleCommand, SaleDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFinancialService _financialService;

    public CreateSaleHandler(IUnitOfWork unitOfWork, IFinancialService financialService)
    {
        _unitOfWork = unitOfWork;
        _financialService = financialService;
    }

    public async Task<SaleDto> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // Validate foreign key entities exist
            await ValidateForeignKeysAsync(request);

            // Validate customer if provided (nullable for cash sales)
            Customer? customer = null;
            if (request.Sale.CustomerId.HasValue)
            {
                customer = await _unitOfWork.Customers.GetByIdAsync(request.Sale.CustomerId.Value);
                if (customer == null)
                    throw new ArgumentException($"Customer with ID '{request.Sale.CustomerId}' not found");
            }

            // Calculate amounts
            var totalAmount = request.Sale.Items.Sum(i => i.Total);
            var creditAmount = totalAmount - request.Sale.CashReceived;

            // Create sale or return
            var sale = new Sale
            {
                CustomerId = request.Sale.CustomerId,
                Date = request.Sale.Date,
                TotalAmount = request.IsReturn ? -totalAmount : totalAmount, // Negative for returns
                CashReceived = request.IsReturn ? -request.Sale.CashReceived : request.Sale.CashReceived,
                CreditAmount = request.IsReturn ? -creditAmount : creditAmount,
                CurrencyId = request.Sale.CurrencyId,
                IsReturn = request.IsReturn,
                Notes = request.Sale.Notes
            };

            // Add sale items (negative quantities for returns)
            foreach (var itemDto in request.Sale.Items)
            {
                sale.Items.Add(new SaleItem
                {
                    ItemId = itemDto.ItemId,
                    Qty = request.IsReturn ? -itemDto.Qty : itemDto.Qty,
                    Price = itemDto.Price,
                    Total = request.IsReturn ? -itemDto.Total : itemDto.Total
                });
            }

            var createdSale = await _unitOfWork.Sales.AddAsync(sale);
            await _unitOfWork.SaveChangesAsync();

            // Record financial transactions
            if (request.Sale.CashReceived > 0)
            {
                var currencyExchange = await _unitOfWork.Currencies.GetByIdAsync(request.Sale.CurrencyId);
                var exchangeRate = currencyExchange?.CurrentExchangeRate ?? 1.0m;
                var amountInBaseCurrency = request.Sale.CashReceived * exchangeRate;

                if (request.IsReturn)
                {
                    // For returns: cash out (refund)
                    await _financialService.RecordCashTransactionAsync(
                        request.Sale.Date,
                        ModuleType.SaleReturn,
                        createdSale.Id,
                        $"Cash refund for return #{createdSale.Id}",
                        request.Sale.CurrencyId,
                        request.Sale.CashReceived,
                        exchangeRate,
                        0,
                        amountInBaseCurrency
                    );
                }
                else
                {
                    // For sales: cash in
                    await _financialService.RecordCashTransactionAsync(
                        request.Sale.Date,
                        ModuleType.Sale,
                        createdSale.Id,
                        $"Cash received from sale #{createdSale.Id}",
                        request.Sale.CurrencyId,
                        request.Sale.CashReceived,
                        exchangeRate,
                        amountInBaseCurrency,
                        0
                    );
                }
            }

            if (customer != null && creditAmount != 0)
            {
                if (request.IsReturn)
                {
                    // For returns: reduce customer balance (credit refund)
                    await _financialService.RecordCustomerTransactionAsync(
                        customer.Id,
                        request.Sale.Date,
                        $"Return #{createdSale.Id}",
                        null,
                        createdSale.Id,
                        0,
                        Math.Abs(creditAmount)
                    );
                }
                else
                {
                    // For sales: increase customer balance (credit sale)
                    await _financialService.RecordCustomerTransactionAsync(
                        customer.Id,
                        request.Sale.Date,
                        $"Sale #{createdSale.Id}",
                        createdSale.Id,
                        null,
                        creditAmount,
                        0
                    );
                }
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return await MapToSaleDtoAsync(createdSale, customer);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private async Task ValidateForeignKeysAsync(CreateSaleCommand request)
    {
        // Validate Currency
        if (request.Sale.CurrencyId <= 0)
        {
            throw new ArgumentException("CurrencyId must be greater than 0. Valid currency IDs: 1 (USD), 2 (EUR), 3 (PKR), 4 (INR)");
        }

        var currency = await _unitOfWork.Currencies.GetByIdAsync(request.Sale.CurrencyId);
        if (currency == null)
            throw new ArgumentException($"Currency with ID '{request.Sale.CurrencyId}' not found. Valid IDs: 1 (USD), 2 (EUR), 3 (PKR), 4 (INR)");

        // Validate Items
        if (!request.Sale.Items.Any())
            throw new ArgumentException("At least one item is required");

        foreach (var itemDto in request.Sale.Items)
        {
            if (itemDto.ItemId <= 0)
                throw new ArgumentException($"ItemId must be greater than 0. Valid item IDs: 1, 2, 3, 4, 5 (see seed data)");

            var item = await _unitOfWork.Items.GetByIdAsync(itemDto.ItemId);
            if (item == null)
                throw new ArgumentException($"Item with ID '{itemDto.ItemId}' not found. Valid IDs: 1, 2, 3, 4, 5 (see seed data)");

            if (itemDto.Qty <= 0)
                throw new ArgumentException($"Item quantity must be greater than 0 for item ID {itemDto.ItemId}");

            if (itemDto.Price <= 0)
                throw new ArgumentException($"Item price must be greater than 0 for item ID {itemDto.ItemId}");
        }

        // Validate Customer if provided
        if (request.Sale.CustomerId.HasValue && request.Sale.CustomerId.Value > 0)
        {
            var customer = await _unitOfWork.Customers.GetByIdAsync(request.Sale.CustomerId.Value);
            if (customer == null)
                throw new ArgumentException($"Customer with ID '{request.Sale.CustomerId}' not found. Valid customer IDs: 1, 2, 3, 4, 5");
        }
    }

    private async Task<SaleDto> MapToSaleDtoAsync(Sale sale, Customer? customer)
    {
        var currency = await _unitOfWork.Currencies.GetByIdAsync(sale.CurrencyId);
        var items = await _unitOfWork.Items.GetAllAsync();

        return new SaleDto
        {
            Id = sale.Id,
            CustomerId = sale.CustomerId,
            CustomerName = customer?.Name ?? "Cash Sale",
            Date = sale.Date,
            TotalAmount = sale.TotalAmount,
            CashReceived = sale.CashReceived,
            CreditAmount = sale.CreditAmount,
            CurrencyId = sale.CurrencyId,
            Currency = currency?.Code ?? "",
            CurrencySymbol = currency?.Symbol ?? "",
            Notes = sale.Notes,
            Items = sale.Items.Select(i => new SaleItemDto
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