namespace ShopManagementSystem.Domain.Entities;

public class SalesReturn : BaseEntity
{
    public int CustomerId { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalReturnAmount { get; set; }
    public decimal CashRefund { get; set; }
    public decimal CreditRefund { get; set; }
    public int CurrencyId { get; set; } = 1;
    public string Notes { get; set; } = string.Empty;
    
    public virtual Customer Customer { get; set; } = null!;
    public virtual Currency Currency { get; set; } = null!;
    public virtual ICollection<SaleReturnItem> Items { get; set; } = new List<SaleReturnItem>();
}

public class SaleReturnItem : BaseEntity
{
    public int SaleReturnId { get; set; }
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
    
    public virtual SalesReturn SalesReturn { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;
}