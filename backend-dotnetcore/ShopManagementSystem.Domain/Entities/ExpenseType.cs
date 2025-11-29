namespace ShopManagementSystem.Domain.Entities;

public class ExpenseType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    
    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}