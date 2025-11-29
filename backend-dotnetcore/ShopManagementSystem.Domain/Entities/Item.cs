namespace ShopManagementSystem.Domain.Entities;

public class Item : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal OpeningQty { get; set; }
    public decimal OpeningCost { get; set; }
    
    public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    public virtual ICollection<SaleReturnItem> SaleReturnItems { get; set; } = new List<SaleReturnItem>();
    public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
    public virtual ICollection<PurchaseReturnItem> PurchaseReturnItems { get; set; } = new List<PurchaseReturnItem>();
}