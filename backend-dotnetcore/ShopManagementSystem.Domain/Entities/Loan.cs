namespace ShopManagementSystem.Domain.Entities;

public enum LoanType
{
    LoanFrom,
    LoanTo
}

public class Loan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public LoanType Type { get; set; }
    public decimal OpeningBalance { get; set; }
    
    public virtual ICollection<LoanTransaction> LoanTransactions { get; set; } = new List<LoanTransaction>();
}