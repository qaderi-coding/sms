using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class TransactionDto
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public PartyType PartyType { get; set; }
    public int? PartyId { get; set; }
    public string PartyName { get; set; } = string.Empty;
    public decimal OriginalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public decimal ExchangeRateToUsd { get; set; }
    public decimal AmountUsd { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateTransactionDto
{
    public TransactionType Type { get; set; }
    public PartyType PartyType { get; set; }
    public int? PartyId { get; set; }
    public decimal OriginalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class UpdateTransactionDto
{
    public string Notes { get; set; } = string.Empty;
}