using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Application.DTOs;

public class LoanDto
{
    public int Id { get; set; }
    public PartyType PartyType { get; set; }
    public int PartyId { get; set; }
    public string PartyName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public LoanStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLoanDto
{
    public PartyType PartyType { get; set; }
    public int PartyId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
}