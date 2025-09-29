namespace ShopManagementSystem.Application.DTOs.Responses;

public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? CompanyId { get; set; }
    public string? CompanyName { get; set; }
    public int? BikeModelId { get; set; }
    public string? BikeModelName { get; set; }
    public int BaseUnitId { get; set; }
    public string BaseUnitName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}