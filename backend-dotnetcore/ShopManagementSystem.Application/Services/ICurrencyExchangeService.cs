using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Application.Services;

public interface ICurrencyExchangeService
{
    Task<decimal> GetExchangeRateToAfghaniAsync(int currencyId, DateTime? date = null);
    Task<decimal> ConvertToAfghaniAsync(decimal amount, int fromCurrencyId, DateTime? date = null);
    Task<decimal> ConvertFromAfghaniAsync(decimal amount, int toCurrencyId, DateTime? date = null);
    Task<CurrencyExchangeRate> SetExchangeRateAsync(int currencyId, decimal rateToAfghani, DateTime? date = null, string source = "Manual");
    Task<IEnumerable<CurrencyExchangeRate>> GetExchangeRateHistoryAsync(int currencyId);
    Task UpdateExchangeRatesAsync(Dictionary<string, decimal> rates, DateTime? date = null, string source = "Manual");
}