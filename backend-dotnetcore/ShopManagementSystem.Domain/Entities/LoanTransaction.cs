namespace ShopManagementSystem.Domain.Entities;

public class LoanTransaction : BaseEntity
{
    public int LoanId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
    public decimal BalanceAfter { get; set; }
    
    public virtual Loan Loan { get; set; } = null!;
}