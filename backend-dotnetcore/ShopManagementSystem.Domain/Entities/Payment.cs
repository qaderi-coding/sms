using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Payment : BaseEntity
{
    public int CurrencyId { get; set; }
    public PartyType PartyType { get; set; }
    public int PartyId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public virtual Currency Currency { get; set; } = null!;
}