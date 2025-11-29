namespace ShopManagementSystem.Domain.Entities;

public class SaleItem : BaseEntity
{
    public int SaleId { get; set; }
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
    
    public virtual Sale Sale { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}