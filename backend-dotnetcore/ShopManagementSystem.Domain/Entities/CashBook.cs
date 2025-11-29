using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class CashBook : BaseEntity
{
    public DateTime Date { get; set; }
    public ModuleType ModuleType { get; set; }
    public int? ModuleId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int CurrencyId { get; set; }
    public decimal OriginalAmount { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal CashIn { get; set; }
    public decimal CashOut { get; set; }
    public decimal BalanceAfter { get; set; }
    
    public virtual Currency Currency { get; set; } = null!;
}