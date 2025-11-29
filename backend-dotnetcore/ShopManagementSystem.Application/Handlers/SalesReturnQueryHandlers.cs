using MediatR;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetSalesReturnsQueryHandler : IRequestHandler<GetSalesReturnsQuery, IEnumerable<SalesReturnDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSalesReturnsQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<SalesReturnDto>> Handle(GetSalesReturnsQuery request, CancellationToken cancellationToken)
    {
        var salesReturns = await _unitOfWork.SalesReturns.GetAllAsync();
        var customers = await _unitOfWork.Customers.GetAllAsync();
        var items = await _unitOfWork.Items.GetAllAsync();
        var currencies = await _unitOfWork.Currencies.GetAllAsync();

        return salesReturns.Select(sr => new SalesReturnDto
        {
            Id = sr.Id,
            CustomerId = sr.CustomerId,
            CustomerName = customers.FirstOrDefault(c => c.Id == sr.CustomerId)?.Name ?? "",
            Date = sr.Date,
            TotalReturnAmount = sr.TotalReturnAmount,
            CashRefund = sr.CashRefund,
            CreditRefund = sr.CreditRefund,
            CurrencyId = sr.CurrencyId,
            Currency = currencies.FirstOrDefault(c => c.Id == sr.CurrencyId)?.Code ?? "",
            CurrencySymbol = currencies.FirstOrDefault(c => c.Id == sr.CurrencyId)?.Symbol ?? "",
            Notes = sr.Notes,
            Items = sr.Items.Select(i => new SaleReturnItemDto
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

public class GetSalesReturnByIdQueryHandler : IRequestHandler<GetSalesReturnByIdQuery, SalesReturnDto?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSalesReturnByIdQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SalesReturnDto?> Handle(GetSalesReturnByIdQuery request, CancellationToken cancellationToken)
    {
        var salesReturn = await _unitOfWork.SalesReturns.GetByIdAsync(request.Id);
        if (salesReturn == null) return null;

        var customer = await _unitOfWork.Customers.GetByIdAsync(salesReturn.CustomerId);
        var items = await _unitOfWork.Items.GetAllAsync();
        var currency = await _unitOfWork.Currencies.GetByIdAsync(salesReturn.CurrencyId);

        return new SalesReturnDto
        {
            Id = salesReturn.Id,
            CustomerId = salesReturn.CustomerId,
            CustomerName = customer?.Name ?? "",
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