namespace ShopManagementSystem.Application.DTOs.Requests;

public class CreateCustomerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal OpeningBalance { get; set; }
}

public class UpdateCustomerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal OpeningBalance { get; set; }
}