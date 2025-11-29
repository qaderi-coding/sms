namespace ShopManagementSystem.Domain.Entities;

public class PurchaseReturn : BaseEntity
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalReturnAmount { get; set; }
    public decimal CashReturn { get; set; }
    public decimal CreditReturn { get; set; }
    public string Notes { get; set; } = string.Empty;
    
    public virtual Supplier Supplier { get; set; } = null!;
    public virtual ICollection<PurchaseReturnItem> Items { get; set; } = new List<PurchaseReturnItem>();
}

public class PurchaseReturnItem : BaseEntity
{
    public int PurchaseReturnId { get; set; }
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Cost { get; set; }
    public decimal Total { get; set; }
    
    public virtual PurchaseReturn PurchaseReturn { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}