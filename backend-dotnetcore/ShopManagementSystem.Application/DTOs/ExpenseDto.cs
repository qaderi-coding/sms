using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class ExpenseDto
{
    public int Id { get; set; }
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateExpenseDto
{
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
}

public class UpdateExpenseDto
{
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
}