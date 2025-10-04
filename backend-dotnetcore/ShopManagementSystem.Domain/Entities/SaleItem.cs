namespace ShopManagementSystem.Domain.Entities;

public class SaleItem : BaseEntity
{
    public int SaleId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = string.Empty;
    
    public virtual Sale Sale { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}