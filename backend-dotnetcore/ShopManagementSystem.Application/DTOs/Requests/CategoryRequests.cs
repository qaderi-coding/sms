namespace ShopManagementSystem.Application.DTOs.Requests;

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}