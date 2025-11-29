using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Application.DTOs;

public class LoanPartyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal CurrentBalance { get; set; }
}

public class CreateLoanPartyDto
{
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
}