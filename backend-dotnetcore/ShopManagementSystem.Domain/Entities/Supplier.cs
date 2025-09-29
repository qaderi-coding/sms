namespace ShopManagementSystem.Domain.Entities;

public class Supplier : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}