using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class SaleDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal Discount { get; set; }
    public decimal FinalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<SaleItemDto> Items { get; set; } = new();
}

public class SaleItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateSaleDto
{
    public int CustomerId { get; set; }
    public DateTime SaleDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal Discount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string Notes { get; set; } = string.Empty;
    public List<CreateSaleItemDto> Items { get; set; } = new();
}

public class CreateSaleItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}