using MediatR;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;

namespace ShopManagementSystem.Application.Commands;

public class CreateBikeModelCommand : IRequest<BikeModelResponse>
{
    public CreateBikeModelRequest Request { get; set; } = null!;
}

public class UpdateBikeModelCommand : IRequest<BikeModelResponse>
{
    public int Id { get; set; }
    public UpdateBikeModelRequest Request { get; set; } = null!;
}

public class DeleteBikeModelCommand : IRequest<bool>
{
    public int Id { get; set; }
}