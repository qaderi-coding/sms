namespace ShopManagementSystem.Domain.Entities;

public class CurrencyExchangeRate : BaseEntity
{
    public int CurrencyId { get; set; }
    public decimal RateToAfghani { get; set; }
    public DateTime Date { get; set; }
    public DateTime EffectiveDate { get; set; }
    public bool IsActive { get; set; } = true;
    public string Source { get; set; } = "Manual";
    
    public virtual Currency Currency { get; set; } = null!;
}