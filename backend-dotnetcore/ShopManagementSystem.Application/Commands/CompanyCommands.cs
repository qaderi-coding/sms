using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateCompanyCommand : IRequest<CompanyResponse>
{
    public CreateCompanyRequest Request { get; set; } = null!;
}

public class UpdateCompanyCommand : IRequest<CompanyResponse>
{
    public int Id { get; set; }
    public UpdateCompanyRequest Request { get; set; } = null!;
}

public class DeleteCompanyCommand : IRequest<bool>
{
    public int Id { get; set; }
}