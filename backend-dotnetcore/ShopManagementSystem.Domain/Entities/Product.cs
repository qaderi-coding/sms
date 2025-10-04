namespace ShopManagementSystem.Domain.Entities;

public class Product : BaseEntity
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
    
    public virtual Category? Category { get; set; }
    public virtual Company? Company { get; set; }
    public virtual BikeModel? BikeModel { get; set; }
    public virtual Unit BaseUnit { get; set; } = null!;
    public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
    public virtual ICollection<ProductItem> ProductItems { get; set; } = new List<ProductItem>();
    public virtual ICollection<ProductUnitConversion> UnitConversions { get; set; } = new List<ProductUnitConversion>();
}