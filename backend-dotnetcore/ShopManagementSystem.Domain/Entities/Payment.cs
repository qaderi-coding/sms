using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Payment : BaseEntity
{
    public int TransactionId { get; set; }
    public PartyType PartyType { get; set; }
    public int PartyId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public PaymentMethod Method { get; set; }
    
    public virtual Transaction Transaction { get; set; } = null!;
}