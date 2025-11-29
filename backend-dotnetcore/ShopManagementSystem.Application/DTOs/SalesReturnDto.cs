namespace ShopManagementSystem.Application.DTOs;

public class SalesReturnDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal TotalReturnAmount { get; set; }
    public decimal CashRefund { get; set; }
    public decimal CreditRefund { get; set; }
    public int CurrencyId { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string CurrencySymbol { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<SaleReturnItemDto> Items { get; set; } = new();
}

public class SaleReturnItemDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
}

public class CreateSalesReturnDto
{
    public int CustomerId { get; set; }
    public DateTime Date { get; set; }
    public decimal CashRefund { get; set; }
    public int CurrencyId { get; set; } = 1;
    public string Notes { get; set; } = string.Empty;
    public List<CreateSaleReturnItemDto> Items { get; set; } = new();
}

public class CreateSaleReturnItemDto
{
    public int ItemId { get; set; }
    public decimal Qty { get; set; }
    public decimal Price { get; set; }
    public decimal Total { get; set; }
}