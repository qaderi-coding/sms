using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCategoriesHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoryResponse>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }
}

public class GetCategoryByIdHandler : IRequestHandler<GetCategoryByIdQuery, CategoryResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCategoryByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryResponse?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(request.Id);
        if (category == null) return null;
        
        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }
}

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, CategoryResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCategoryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category
        {
            Name = request.Request.Name,
            Description = request.Request.Description
        };

        var createdCategory = await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        
        return new CategoryResponse
        {
            Id = createdCategory.Id,
            Name = createdCategory.Name,
            Description = createdCategory.Description,
            CreatedAt = createdCategory.CreatedAt,
            UpdatedAt = createdCategory.UpdatedAt
        };
    }
}

public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand, CategoryResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCategoryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CategoryResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(request.Id);
        if (category == null)
            throw new KeyNotFoundException($"Category with ID {request.Id} not found");

        category.Name = request.Request.Name;
        category.Description = request.Request.Description;
        category.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();
        
        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }
}

public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCategoryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(request.Id);
        if (category == null)
            return false;

        await _unitOfWork.Categories.DeleteAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}