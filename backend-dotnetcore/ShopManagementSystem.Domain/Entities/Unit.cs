namespace ShopManagementSystem.Domain.Entities;

public class Unit : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public virtual ICollection<ProductUnitConversion> ProductUnitConversions { get; set; } = new List<ProductUnitConversion>();
}