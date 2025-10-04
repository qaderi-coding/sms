using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Transaction : BaseEntity
{
    public TransactionType Type { get; set; }
    public PartyType PartyType { get; set; }
    public int? PartyId { get; set; }
    public decimal OriginalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal ExchangeRateToUsd { get; set; }
    public decimal AmountUsd { get; set; }
    public string Notes { get; set; } = string.Empty;
    
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}