namespace ShopManagementSystem.Application.DTOs.Requests;

public class CreateBikeModelRequest
{
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateBikeModelRequest
{
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}