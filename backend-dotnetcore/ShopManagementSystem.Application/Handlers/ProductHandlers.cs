using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetProductsHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProductResponse>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return products.Select(p => new ProductResponse
        {
            Id = p.Id,
            Name = p.Name,
            Sku = p.Sku,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category?.Name,
            CompanyId = p.CompanyId,
            CompanyName = p.Company?.Name,
            BikeModelId = p.BikeModelId,
            BikeModelName = p.BikeModel?.Name,
            BaseUnitId = p.BaseUnitId,
            BaseUnitName = p.BaseUnit?.Name ?? "",
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        });
    }
}

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetProductByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductResponse?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id);
        if (product == null) return null;

        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Description = product.Description,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            CompanyId = product.CompanyId,
            CompanyName = product.Company?.Name,
            BikeModelId = product.BikeModelId,
            BikeModelName = product.BikeModel?.Name,
            BaseUnitId = product.BaseUnitId,
            BaseUnitName = product.BaseUnit?.Name ?? "",
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

public class CreateProductHandler : IRequestHandler<CreateProductCommand, ProductResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Request.Name,
            Sku = request.Request.Sku,
            Price = request.Request.Price,
            StockQuantity = request.Request.StockQuantity,
            Description = request.Request.Description,
            CategoryId = request.Request.CategoryId,
            CompanyId = request.Request.CompanyId,
            BikeModelId = request.Request.BikeModelId,
            BaseUnitId = request.Request.BaseUnitId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return new ProductResponse
        {
            Id = created.Id,
            Name = created.Name,
            Sku = created.Sku,
            Price = created.Price,
            StockQuantity = created.StockQuantity,
            Description = created.Description,
            CategoryId = created.CategoryId,
            CategoryName = created.Category?.Name,
            CompanyId = created.CompanyId,
            CompanyName = created.Company?.Name,
            BikeModelId = created.BikeModelId,
            BikeModelName = created.BikeModel?.Name,
            BaseUnitId = created.BaseUnitId,
            BaseUnitName = created.BaseUnit?.Name ?? "",
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }
}

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, ProductResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id);
        if (product == null) throw new KeyNotFoundException();

        // Update only the fields from request, preserve audit fields
        product.Name = request.Request.Name;
        product.Sku = request.Request.Sku;
        product.Price = request.Request.Price;
        product.StockQuantity = request.Request.StockQuantity;
        product.Description = request.Request.Description;
        product.CategoryId = request.Request.CategoryId;
        product.CompanyId = request.Request.CompanyId;
        product.BikeModelId = request.Request.BikeModelId;
        product.BaseUnitId = request.Request.BaseUnitId;
        product.UpdatedAt = DateTime.UtcNow;
        // CreatedAt is preserved

        await _unitOfWork.Products.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Description = product.Description,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            CompanyId = product.CompanyId,
            CompanyName = product.Company?.Name,
            BikeModelId = product.BikeModelId,
            BikeModelName = product.BikeModel?.Name,
            BaseUnitId = product.BaseUnitId,
            BaseUnitName = product.BaseUnit?.Name ?? "",
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id);
        if (product == null) return false;

        await _unitOfWork.Products.DeleteAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}