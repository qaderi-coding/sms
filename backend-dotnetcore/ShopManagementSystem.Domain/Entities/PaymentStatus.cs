namespace ShopManagementSystem.Domain.Entities;

public class PaymentStatus : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}