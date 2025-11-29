namespace ShopManagementSystem.Domain.Entities;

public class SupplierTransaction : BaseEntity
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? PurchaseId { get; set; }
    public int? PaymentId { get; set; }
    public decimal CreditAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal BalanceAfter { get; set; }
    
    public virtual Supplier Supplier { get; set; } = null!;
}