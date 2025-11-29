using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Domain.Interfaces;

public interface ICurrencyExchangeRateRepository : IRepository<CurrencyExchangeRate>
{
    Task<CurrencyExchangeRate?> GetActiveRateAsync(int currencyId, DateTime? date = null);
    Task<IEnumerable<CurrencyExchangeRate>> GetHistoryAsync(int currencyId);
}