namespace ShopManagementSystem.Domain.Entities;

public class CustomerTransaction : BaseEntity
{
    public int CustomerId { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? InvoiceId { get; set; }
    public int? PaymentId { get; set; }
    public decimal CreditAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal BalanceAfter { get; set; }
    
    public virtual Customer Customer { get; set; } = null!;
}