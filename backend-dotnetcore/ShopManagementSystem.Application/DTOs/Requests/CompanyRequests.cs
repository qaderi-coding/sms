namespace ShopManagementSystem.Application.DTOs.Requests;

public class CreateCompanyRequest
{
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}

public class UpdateCompanyRequest
{
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}