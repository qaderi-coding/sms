using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetCompaniesQuery : IRequest<IEnumerable<CompanyResponse>>
{
}

public class GetCompanyByIdQuery : IRequest<CompanyResponse?>
{
    public int Id { get; set; }
}