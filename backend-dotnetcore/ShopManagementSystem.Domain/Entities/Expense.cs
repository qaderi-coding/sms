namespace ShopManagementSystem.Domain.Entities;

public class Expense : BaseEntity
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int ExpenseTypeId { get; set; }
    public int CurrencyId { get; set; }
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string Description { get; set; } = string.Empty;
    
    public virtual ExpenseType ExpenseType { get; set; } = null!;
    public virtual Currency Currency { get; set; } = null!;
}