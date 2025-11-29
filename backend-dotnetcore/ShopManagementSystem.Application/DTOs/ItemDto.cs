namespace ShopManagementSystem.Application.DTOs;

public class ItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal OpeningQty { get; set; }
    public decimal OpeningCost { get; set; }
}

public class CreateItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal OpeningQty { get; set; }
    public decimal OpeningCost { get; set; }
}