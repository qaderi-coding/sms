using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetSuppliersHandler : IRequestHandler<GetSuppliersQuery, IEnumerable<SupplierResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSuppliersHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<SupplierResponse>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
    {
        var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
        return suppliers.Select(s => new SupplierResponse
        {
            Id = s.Id,
            Name = s.Name,
            Phone = s.Phone,
            Address = s.Address,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        });
    }
}

public class GetSupplierByIdHandler : IRequestHandler<GetSupplierByIdQuery, SupplierResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSupplierByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SupplierResponse?> Handle(GetSupplierByIdQuery request, CancellationToken cancellationToken)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(request.Id);
        if (supplier == null) return null;

        return new SupplierResponse
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Phone = supplier.Phone,
            Address = supplier.Address,
            CreatedAt = supplier.CreatedAt,
            UpdatedAt = supplier.UpdatedAt
        };
    }
}

public class CreateSupplierHandler : IRequestHandler<CreateSupplierCommand, SupplierResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateSupplierHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SupplierResponse> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = new Supplier
        {
            Name = request.Request.Name,
            Phone = request.Request.Phone,
            Address = request.Request.Address
        };

        var created = await _unitOfWork.Suppliers.AddAsync(supplier);
        await _unitOfWork.SaveChangesAsync();

        return new SupplierResponse
        {
            Id = created.Id,
            Name = created.Name,
            Phone = created.Phone,
            Address = created.Address,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }
}

public class UpdateSupplierHandler : IRequestHandler<UpdateSupplierCommand, SupplierResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSupplierHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<SupplierResponse> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(request.Id);
        if (supplier == null) throw new KeyNotFoundException();

        supplier.Name = request.Request.Name;
        supplier.Phone = request.Request.Phone;
        supplier.Address = request.Request.Address;
        supplier.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Suppliers.UpdateAsync(supplier);
        await _unitOfWork.SaveChangesAsync();

        return new SupplierResponse
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Phone = supplier.Phone,
            Address = supplier.Address,
            CreatedAt = supplier.CreatedAt,
            UpdatedAt = supplier.UpdatedAt
        };
    }
}

public class DeleteSupplierHandler : IRequestHandler<DeleteSupplierCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSupplierHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(request.Id);
        if (supplier == null) return false;

        await _unitOfWork.Suppliers.DeleteAsync(supplier);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}