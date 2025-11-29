namespace ShopManagementSystem.Domain.Entities;

public class Sale : BaseEntity
{
    public int? CustomerId { get; set; } // nullable for cash sales
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CashReceived { get; set; }
    public decimal CreditAmount { get; set; }
    public int CurrencyId { get; set; } = 1;
    public bool IsReturn { get; set; } = false; // true for returns, false for sales
    public string Notes { get; set; } = string.Empty;
    
    public virtual Customer? Customer { get; set; }
    public virtual Currency Currency { get; set; } = null!;
    public virtual ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
}