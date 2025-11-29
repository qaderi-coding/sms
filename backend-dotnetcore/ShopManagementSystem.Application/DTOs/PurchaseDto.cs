using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class PurchaseDto
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CashPaid { get; set; }
    public decimal CreditAmount { get; set; }
    public int CurrencyId { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string CurrencySymbol { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<PurchaseItemDto> Items { get; set; } = new();
}

public class PurchaseItemDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal Qty { get; set; }
    public decimal Cost { get; set; }
    public decimal Total { get; set; }
}

public class CreatePurchaseDto
{
    public int SupplierId { get; set; }
    public DateTime Date { get; set; }
    public decimal CashPaid { get; set; }
    public int CurrencyId { get; set; } = 1;
    public string Notes { get; set; } = string.Empty;
    public List<CreatePurchaseItemDto> Items { get; set; } = new();
}

public class CreatePurchaseItemDto
{
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Cost { get; set; }
    public decimal Total { get; set; }
}