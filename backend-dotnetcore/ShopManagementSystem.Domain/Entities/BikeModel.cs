namespace ShopManagementSystem.Domain.Entities;

public class BikeModel : BaseEntity
{
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public virtual Company Company { get; set; } = null!;
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}