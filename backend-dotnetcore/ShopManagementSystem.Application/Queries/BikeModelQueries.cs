using MediatR;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Queries;

public class GetBikeModelsQuery : IRequest<IEnumerable<BikeModelResponse>>
{
}

public class GetBikeModelByIdQuery : IRequest<BikeModelResponse?>
{
    public int Id { get; set; }
}