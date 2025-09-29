namespace ShopManagementSystem.Application.DTOs.Requests;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public int? CompanyId { get; set; }
    public int? BikeModelId { get; set; }
    public int BaseUnitId { get; set; }
}

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public int? CompanyId { get; set; }
    public int? BikeModelId { get; set; }
    public int BaseUnitId { get; set; }
}