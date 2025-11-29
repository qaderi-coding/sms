namespace ShopManagementSystem.Domain.Entities;

public class Capital : BaseEntity
{
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
    public decimal BalanceAfter { get; set; }
}