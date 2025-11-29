namespace ShopManagementSystem.Application.DTOs;

public class SaleDto
{
    public int Id { get; set; }
    public int? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal CashReceived { get; set; }
    public decimal CreditAmount { get; set; }
    public int CurrencyId { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string CurrencySymbol { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<SaleItemDto> Items { get; set; } = new();
}

public class SaleItemDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
}

public class CreateSaleDto
{
    public int? CustomerId { get; set; }
    public DateTime Date { get; set; }
    public decimal CashReceived { get; set; }
    public int CurrencyId { get; set; } = 1;
    public string Notes { get; set; } = string.Empty;
    public List<CreateSaleItemDto> Items { get; set; } = new();
}

public class CreateSaleItemDto
{
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
}