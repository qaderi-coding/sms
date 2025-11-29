using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class CashBookDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public ModuleType ModuleType { get; set; }
    public int? ModuleId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int CurrencyId { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public decimal OriginalAmount { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal CashIn { get; set; }
    public decimal CashOut { get; set; }
    public decimal BalanceAfter { get; set; }
}

public class CustomerTransactionDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? InvoiceId { get; set; }
    public int? PaymentId { get; set; }
    public decimal CreditAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal BalanceAfter { get; set; }
}

public class SupplierTransactionDto
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? PurchaseId { get; set; }
    public int? PaymentId { get; set; }
    public decimal CreditAmount { get; set; }
    public decimal PaymentAmount { get; set; }
    public decimal BalanceAfter { get; set; }
}

public class LoanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal CurrentBalance { get; set; }
}

public class LoanTransactionDto
{
    public int Id { get; set; }
    public int LoanId { get; set; }
    public string LoanName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
    public decimal BalanceAfter { get; set; }
}

public class CapitalDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AmountIn { get; set; }
    public decimal AmountOut { get; set; }
    public decimal BalanceAfter { get; set; }
}