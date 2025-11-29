using Microsoft.Extensions.Logging;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopManagementSystem.Application.Services
{
    public class CurrencyExchangeService : ICurrencyExchangeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CurrencyExchangeService> _logger;

        public CurrencyExchangeService(IUnitOfWork unitOfWork, ILogger<CurrencyExchangeService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<decimal> GetExchangeRateToAfghaniAsync(int currencyId, DateTime? date = null)
        {
            // AFN to AFN is always 1
            var currency = await _unitOfWork.Currencies.GetByIdAsync(currencyId);
            if (currency?.Code == "AFN")
                return 1.0m;

            var effectiveDate = date ?? DateTime.UtcNow;
            
            // Use the new repository method
            var rate = await _unitOfWork.CurrencyExchangeRates.GetActiveRateAsync(currencyId, effectiveDate);

            return rate?.RateToAfghani ?? 
                throw new InvalidOperationException($"No active exchange rate found for currency ID {currencyId}");
        }

        public async Task<decimal> ConvertToAfghaniAsync(decimal amount, int fromCurrencyId, DateTime? date = null)
        {
            if (fromCurrencyId <= 0) throw new ArgumentException("Invalid currency ID");
            
            var rate = await GetExchangeRateToAfghaniAsync(fromCurrencyId, date);
            return amount * rate;
        }

        public async Task<decimal> ConvertFromAfghaniAsync(decimal amount, int toCurrencyId, DateTime? date = null)
        {
            if (toCurrencyId <= 0) throw new ArgumentException("Invalid currency ID");
            
            var rate = await GetExchangeRateToAfghaniAsync(toCurrencyId, date);
            return amount / rate;
        }

        public async Task<decimal> ConvertAsync(decimal amount, int fromCurrencyId, int toCurrencyId, DateTime? date = null)
        {
            if (fromCurrencyId == toCurrencyId) return amount;
            
            // Convert to Afghani first, then to target currency
            var amountInAfghani = await ConvertToAfghaniAsync(amount, fromCurrencyId, date);
            return await ConvertFromAfghaniAsync(amountInAfghani, toCurrencyId, date);
        }

        public async Task<CurrencyExchangeRate> SetExchangeRateAsync(int currencyId, decimal rateToAfghani, 
            DateTime? date = null, string source = "Manual")
        {
            if (rateToAfghani <= 0) throw new ArgumentException("Exchange rate must be positive");

            await _unitOfWork.BeginTransactionAsync();
            
            try
            {
                // Deactivate existing rates for this currency
                var existingActiveRates = (await _unitOfWork.CurrencyExchangeRates.GetAllAsync())
                    .Where(r => r.CurrencyId == currencyId && r.IsActive);
                
                foreach (var existingRate in existingActiveRates)
                {
                    existingRate.IsActive = false;
                    await _unitOfWork.CurrencyExchangeRates.UpdateAsync(existingRate);
                }

                // Create new rate
                var rateDate = date?.Date ?? DateTime.UtcNow.Date;
                var effectiveDate = date ?? DateTime.UtcNow;
                
                var newRate = new CurrencyExchangeRate
                {
                    CurrencyId = currencyId,
                    RateToAfghani = rateToAfghani,
                    Date = rateDate,
                    EffectiveDate = effectiveDate,
                    IsActive = true,
                    Source = source
                };

                await _unitOfWork.CurrencyExchangeRates.AddAsync(newRate);
                
                // Update currency's current exchange rate
                var currency = await _unitOfWork.Currencies.GetByIdAsync(currencyId);
                if (currency != null)
                {
                    currency.CurrentExchangeRate = rateToAfghani;
                    currency.LastUpdated = DateTime.UtcNow;
                    await _unitOfWork.Currencies.UpdateAsync(currency);
                }
                
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return newRate;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<IEnumerable<CurrencyExchangeRate>> GetExchangeRateHistoryAsync(int currencyId)
        {
            return await _unitOfWork.CurrencyExchangeRates.GetHistoryAsync(currencyId);
        }

        public async Task UpdateExchangeRatesAsync(Dictionary<string, decimal> rates, DateTime? date = null, string source = "Manual")
        {
            var currencies = await _unitOfWork.Currencies.GetAllAsync();

            foreach (var rate in rates)
            {
                var currency = currencies.FirstOrDefault(c => c.Code.ToUpper() == rate.Key.ToUpper());
                if (currency != null && currency.Code != "AFN")
                {
                    await SetExchangeRateAsync(currency.Id, rate.Value, date, source);
                }
            }
        }
    }
}