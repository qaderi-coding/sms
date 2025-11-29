namespace ShopManagementSystem.Domain.Entities;

public class Purchase : BaseEntity
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CashPaid { get; set; }
    public decimal CreditAmount { get; set; }
    public int CurrencyId { get; set; } = 1;
    public bool IsReturn { get; set; } = false; // true for returns, false for purchases
    public string Notes { get; set; } = string.Empty;
    
    public virtual Supplier Supplier { get; set; } = null!;
    public virtual Currency Currency { get; set; } = null!;
    public virtual ICollection<PurchaseItem> Items { get; set; } = new List<PurchaseItem>();
}

public class PurchaseItem : BaseEntity
{
    public int PurchaseId { get; set; }
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Cost { get; set; }
    public decimal Total { get; set; }
    
    public virtual Purchase Purchase { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}