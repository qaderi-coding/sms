using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Expense : BaseEntity
{
    public int TransactionId { get; set; }
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    
    public virtual Transaction Transaction { get; set; } = null!;
}