using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class Sale : BaseEntity
{
    public int TransactionId { get; set; }
    public int CustomerId { get; set; }
    public DateTime SaleDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal Discount { get; set; }
    public decimal FinalAmount { get; set; }
    public PaymentStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
    
    public virtual Transaction Transaction { get; set; } = null!;
    public virtual Customer Customer { get; set; } = null!;
    public virtual ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
}