using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Loan : BaseEntity
{
    public int TransactionId { get; set; }
    public PartyType PartyType { get; set; }
    public int PartyId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public LoanStatus Status { get; set; }
    
    public virtual Transaction Transaction { get; set; } = null!;
}