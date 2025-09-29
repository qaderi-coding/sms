namespace ShopManagementSystem.Domain.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    
    public virtual ICollection<BikeModel> BikeModels { get; set; } = new List<BikeModel>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}