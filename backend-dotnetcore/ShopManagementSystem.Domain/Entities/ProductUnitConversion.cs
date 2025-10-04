namespace ShopManagementSystem.Domain.Entities;

public class ProductUnitConversion : BaseEntity
{
    public int ProductId { get; set; }
    public int UnitId { get; set; }
    public decimal Factor { get; set; }
    
    public virtual Product Product { get; set; } = null!;
    public virtual Unit Unit { get; set; } = null!;
}