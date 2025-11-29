using MediatR;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetSalesQueryHandler : IRequestHandler<GetSalesQuery, IEnumerable<SaleDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSalesQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<SaleDto>> Handle(GetSalesQuery request, CancellationToken cancellationToken)
    {
        var sales = await _unitOfWork.Sales.GetAllAsync();
        
        // Filter by IsReturn if specified
        if (request.IsReturn.HasValue)
        {
            sales = sales.Where(s => s.IsReturn == request.IsReturn.Value);
        }
        
        var customers = await _unitOfWork.Customers.GetAllAsync();
        var items = await _unitOfWork.Items.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();

        return sales.Select(s => new SaleDto
        {
            Id = s.Id,
            CustomerId = s.CustomerId,
            CustomerName = customers.FirstOrDefault(c => c.Id == s.CustomerId)?.Name ?? "",
            Date = s.Date,
            TotalAmount = s.TotalAmount,
            CashReceived = s.CashReceived,
            CreditAmount = s.CreditAmount,
            CurrencyId = s.CurrencyId,
            Currency = currencies.FirstOrDefault(c => c.Id == s.CurrencyId)?.Code ?? "",
            CurrencySymbol = currencies.FirstOrDefault(c => c.Id == s.CurrencyId)?.Symbol ?? "",
            Notes = s.Notes,
            Items = s.Items.Select(i => new SaleItemDto
            {
                Id = i.Id,
                ItemId = i.ItemId,
                ItemName = items.FirstOrDefault(item => item.Id == i.ItemId)?.Name ?? "",
                Qty = i.Qty,
                Price = i.Price,
                Total = i.Total
            }).ToList()
        });
    }
}

public class GetSaleByIdQueryHandler : IRequestHandler<GetSaleByIdQuery, SaleDto?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSaleByIdQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SaleDto?> Handle(GetSaleByIdQuery request, CancellationToken cancellationToken)
    {
        var sale = await _unitOfWork.Sales.GetByIdAsync(request.Id);
        if (sale == null) return null;

        var customer = sale.CustomerId.HasValue ? await _unitOfWork.Customers.GetByIdAsync(sale.CustomerId.Value) : null;
        var items = await _unitOfWork.Items.GetAllAsync();
        var currency = await _unitOfWork.Currencies.GetByIdAsync(sale.CurrencyId);

        return new SaleDto
        {
            Id = sale.Id,
            CustomerId = sale.CustomerId,
            CustomerName = customer?.Name ?? "",
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