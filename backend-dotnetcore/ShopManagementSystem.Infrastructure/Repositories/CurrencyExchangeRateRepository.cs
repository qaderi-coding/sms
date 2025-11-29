using Microsoft.EntityFrameworkCore;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Infrastructure.Data;

namespace ShopManagementSystem.Infrastructure.Repositories;

public class CurrencyExchangeRateRepository : Repository<CurrencyExchangeRate>, ICurrencyExchangeRateRepository
{
    public CurrencyExchangeRateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CurrencyExchangeRate?> GetActiveRateAsync(int currencyId, DateTime? date = null)
    {
        var effectiveDate = date ?? DateTime.UtcNow;
        
        return await _context.Set<CurrencyExchangeRate>()
            .Where(r => r.CurrencyId == currencyId && r.IsActive)
            .OrderByDescending(r => r.EffectiveDate)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<CurrencyExchangeRate>> GetHistoryAsync(int currencyId)
    {
        return await _context.Set<CurrencyExchangeRate>()
            .Where(r => r.CurrencyId == currencyId)
            .OrderByDescending(r => r.EffectiveDate)
            .ToListAsync();
    }
}