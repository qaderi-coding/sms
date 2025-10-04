using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Domain.Entities;

public class StockMovement : BaseEntity
{
    public int ProductItemId { get; set; }
    public StockMovementType TransactionType { get; set; }
    public decimal Quantity { get; set; }
    public string Notes { get; set; } = string.Empty;
    
    public virtual ProductItem ProductItem { get; set; } = null!;
}