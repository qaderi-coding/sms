using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class CreateSaleHandler : IRequestHandler<CreateSaleCommand, SaleDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateSaleHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SaleDto> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var sale = new Sale
            {
                CustomerId = request.Sale.CustomerId,
                SaleDate = request.Sale.SaleDate,
                Discount = request.Sale.Discount,
                Status = request.Sale.PaymentStatus,
                Notes = request.Sale.Notes,
                Currency = "USD",
                TotalAmount = request.Sale.Items.Sum(i => i.TotalPrice),
                FinalAmount = request.Sale.Items.Sum(i => i.TotalPrice) - request.Sale.Discount
            };

            foreach (var itemDto in request.Sale.Items)
            {
                sale.Items.Add(new SaleItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.UnitPrice,
                    TotalPrice = itemDto.TotalPrice,
                    Currency = "USD"
                });
            }

            var createdSale = await _unitOfWork.Sales.AddAsync(sale);
            await _unitOfWork.SaveChangesAsync();
            
            var customer = await _unitOfWork.Customers.GetByIdAsync(createdSale.CustomerId);

            await _unitOfWork.CommitTransactionAsync();

            return new SaleDto
            {
                Id = createdSale.Id,
                CustomerId = createdSale.CustomerId,
                CustomerName = customer?.Name ?? "",
                SaleDate = createdSale.SaleDate,
                TotalAmount = createdSale.TotalAmount,
                Discount = createdSale.Discount,
                FinalAmount = createdSale.FinalAmount,
                PaymentStatus = createdSale.Status,
                Notes = createdSale.Notes,
                Items = createdSale.Items.Select(i => new SaleItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            };
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}