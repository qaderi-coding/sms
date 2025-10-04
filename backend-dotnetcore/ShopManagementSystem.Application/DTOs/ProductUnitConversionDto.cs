namespace ShopManagementSystem.Application.DTOs;

public class ProductUnitConversionDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int UnitId { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public string UnitSymbol { get; set; } = string.Empty;
    public decimal Factor { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateProductUnitConversionDto
{
    public int ProductId { get; set; }
    public int UnitId { get; set; }
    public decimal Factor { get; set; }
}

public class UpdateProductUnitConversionDto
{
    public int ProductId { get; set; }
    public int UnitId { get; set; }
    public decimal Factor { get; set; }
}