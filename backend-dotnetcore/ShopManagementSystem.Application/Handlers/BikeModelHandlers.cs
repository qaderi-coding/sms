using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetBikeModelsHandler : IRequestHandler<GetBikeModelsQuery, IEnumerable<BikeModelResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetBikeModelsHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<BikeModelResponse>> Handle(GetBikeModelsQuery request, CancellationToken cancellationToken)
    {
        var bikeModels = await _unitOfWork.BikeModels.GetAllAsync();
        return bikeModels.Select(bm => new BikeModelResponse
        {
            Id = bm.Id,
            CompanyId = bm.CompanyId,
            CompanyName = bm.Company?.Name ?? "",
            Name = bm.Name,
            Description = bm.Description,
            CreatedAt = bm.CreatedAt,
            UpdatedAt = bm.UpdatedAt
        });
    }
}

public class GetBikeModelByIdHandler : IRequestHandler<GetBikeModelByIdQuery, BikeModelResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetBikeModelByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BikeModelResponse?> Handle(GetBikeModelByIdQuery request, CancellationToken cancellationToken)
    {
        var bikeModel = await _unitOfWork.BikeModels.GetByIdAsync(request.Id);
        if (bikeModel == null) return null;

        return new BikeModelResponse
        {
            Id = bikeModel.Id,
            CompanyId = bikeModel.CompanyId,
            CompanyName = bikeModel.Company?.Name ?? "",
            Name = bikeModel.Name,
            Description = bikeModel.Description,
            CreatedAt = bikeModel.CreatedAt,
            UpdatedAt = bikeModel.UpdatedAt
        };
    }
}

public class CreateBikeModelHandler : IRequestHandler<CreateBikeModelCommand, BikeModelResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateBikeModelHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BikeModelResponse> Handle(CreateBikeModelCommand request, CancellationToken cancellationToken)
    {
        var bikeModel = new BikeModel
        {
            CompanyId = request.Request.CompanyId,
            Name = request.Request.Name,
            Description = request.Request.Description
        };

        var created = await _unitOfWork.BikeModels.AddAsync(bikeModel);
        await _unitOfWork.SaveChangesAsync();

        return new BikeModelResponse
        {
            Id = created.Id,
            CompanyId = created.CompanyId,
            CompanyName = created.Company?.Name ?? "",
            Name = created.Name,
            Description = created.Description,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }
}

public class UpdateBikeModelHandler : IRequestHandler<UpdateBikeModelCommand, BikeModelResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBikeModelHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BikeModelResponse> Handle(UpdateBikeModelCommand request, CancellationToken cancellationToken)
    {
        var bikeModel = await _unitOfWork.BikeModels.GetByIdAsync(request.Id);
        if (bikeModel == null) throw new KeyNotFoundException();

        bikeModel.CompanyId = request.Request.CompanyId;
        bikeModel.Name = request.Request.Name;
        bikeModel.Description = request.Request.Description;
        bikeModel.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.BikeModels.UpdateAsync(bikeModel);
        await _unitOfWork.SaveChangesAsync();

        return new BikeModelResponse
        {
            Id = bikeModel.Id,
            CompanyId = bikeModel.CompanyId,
            CompanyName = bikeModel.Company?.Name ?? "",
            Name = bikeModel.Name,
            Description = bikeModel.Description,
            CreatedAt = bikeModel.CreatedAt,
            UpdatedAt = bikeModel.UpdatedAt
        };
    }
}

public class DeleteBikeModelHandler : IRequestHandler<DeleteBikeModelCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBikeModelHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteBikeModelCommand request, CancellationToken cancellationToken)
    {
        var bikeModel = await _unitOfWork.BikeModels.GetByIdAsync(request.Id);
        if (bikeModel == null) return false;

        await _unitOfWork.BikeModels.DeleteAsync(bikeModel);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}