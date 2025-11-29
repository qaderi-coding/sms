namespace ShopManagementSystem.Domain.Entities;

public class Customer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal OpeningBalance { get; set; }
    
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    public virtual ICollection<SalesReturn> SalesReturns { get; set; } = new List<SalesReturn>();
    public virtual ICollection<CustomerTransaction> CustomerTransactions { get; set; } = new List<CustomerTransaction>();
}