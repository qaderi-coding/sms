namespace ShopManagementSystem.Domain.Entities;

public class Currency : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsBaseCurrency { get; set; } = false;
    public decimal CurrentExchangeRate { get; set; } = 1.0m;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<CashBook> CashBooks { get; set; } = new List<CashBook>();
    public virtual ICollection<CurrencyExchangeRate> ExchangeRates { get; set; } = new List<CurrencyExchangeRate>();
}