using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetCompaniesHandler : IRequestHandler<GetCompaniesQuery, IEnumerable<CompanyResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCompaniesHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CompanyResponse>> Handle(GetCompaniesQuery request, CancellationToken cancellationToken)
    {
        var companies = await _unitOfWork.Companies.GetAllAsync();
        return companies.Select(c => new CompanyResponse
        {
            Id = c.Id,
            Name = c.Name,
            Country = c.Country,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }
}

public class GetCompanyByIdHandler : IRequestHandler<GetCompanyByIdQuery, CompanyResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCompanyByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse?> Handle(GetCompanyByIdQuery request, CancellationToken cancellationToken)
    {
        var company = await _unitOfWork.Companies.GetByIdAsync(request.Id);
        if (company == null) return null;

        return new CompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            Country = company.Country,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}

public class CreateCompanyHandler : IRequestHandler<CreateCompanyCommand, CompanyResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCompanyHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        var company = new Company
        {
            Name = request.Request.Name,
            Country = request.Request.Country
        };

        var created = await _unitOfWork.Companies.AddAsync(company);
        await _unitOfWork.SaveChangesAsync();

        return new CompanyResponse
        {
            Id = created.Id,
            Name = created.Name,
            Country = created.Country,
            CreatedAt = created.CreatedAt,
            UpdatedAt = created.UpdatedAt
        };
    }
}

public class UpdateCompanyHandler : IRequestHandler<UpdateCompanyCommand, CompanyResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCompanyHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
    {
        var company = await _unitOfWork.Companies.GetByIdAsync(request.Id);
        if (company == null) throw new KeyNotFoundException();

        company.Name = request.Request.Name;
        company.Country = request.Request.Country;
        company.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Companies.UpdateAsync(company);
        await _unitOfWork.SaveChangesAsync();

        return new CompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            Country = company.Country,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}

public class DeleteCompanyHandler : IRequestHandler<DeleteCompanyCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCompanyHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteCompanyCommand request, CancellationToken cancellationToken)
    {
        var company = await _unitOfWork.Companies.GetByIdAsync(request.Id);
        if (company == null) return false;

        await _unitOfWork.Companies.DeleteAsync(company);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}