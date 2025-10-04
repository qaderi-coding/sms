namespace ShopManagementSystem.Domain.Entities;

public class ProductItem : BaseEntity
{
    public int ProductId { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal ExchangeRateToUsd { get; set; }
    public decimal Quantity { get; set; }
    
    public virtual Product Product { get; set; } = null!;
    public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}