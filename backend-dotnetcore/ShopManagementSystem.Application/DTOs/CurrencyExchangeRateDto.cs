namespace ShopManagementSystem.Application.DTOs;

public class CurrencyExchangeRateDto
{
    public int Id { get; set; }
    public int CurrencyId { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public string CurrencyName { get; set; } = string.Empty;
    public decimal RateToAfghani { get; set; }
    public DateTime Date { get; set; }
    public DateTime EffectiveDate { get; set; }
    public bool IsActive { get; set; }
    public string Source { get; set; } = string.Empty;
}

public class CreateCurrencyExchangeRateDto
{
    public int CurrencyId { get; set; }
    public decimal RateToAfghani { get; set; }
    public DateTime? Date { get; set; }
    public string Source { get; set; } = "Manual";
}

public class CurrentRateDto
{
    public int CurrencyId { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public string CurrencyName { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public bool IsBaseCurrency { get; set; }
    public decimal CurrentExchangeRate { get; set; }
    public DateTime LastUpdated { get; set; }
}