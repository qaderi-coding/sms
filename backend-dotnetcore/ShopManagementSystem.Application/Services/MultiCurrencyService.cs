using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Services;

public interface IMultiCurrencyService
{
    Task<decimal> ConvertToBaseCurrencyAsync(decimal amount, int currencyId);
    Task<decimal> ConvertFromBaseCurrencyAsync(decimal amount, int currencyId);
    Task<decimal> GetExchangeRateAsync(int currencyId);
}

public class MultiCurrencyService : IMultiCurrencyService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrencyExchangeService _currencyExchangeService;

    public MultiCurrencyService(IUnitOfWork unitOfWork, ICurrencyExchangeService currencyExchangeService)
    {
        _unitOfWork = unitOfWork;
        _currencyExchangeService = currencyExchangeService;
    }

    public async Task<decimal> ConvertToBaseCurrencyAsync(decimal amount, int currencyId)
    {
        // If it's already base currency (Afghani), return as is
        var currency = await _unitOfWork.Currencies.GetByIdAsync(currencyId);
        if (currency?.Code == "AFN")
            return amount;

        return await _currencyExchangeService.ConvertToAfghaniAsync(amount, currencyId);
    }

    public async Task<decimal> ConvertFromBaseCurrencyAsync(decimal amount, int currencyId)
    {
        // If it's base currency (Afghani), return as is
        var currency = await _unitOfWork.Currencies.GetByIdAsync(currencyId);
        if (currency?.Code == "AFN")
            return amount;

        var exchangeRate = await _currencyExchangeService.GetExchangeRateToAfghaniAsync(currencyId);
        return amount / exchangeRate;
    }

    public async Task<decimal> GetExchangeRateAsync(int currencyId)
    {
        return await _currencyExchangeService.GetExchangeRateToAfghaniAsync(currencyId);
    }
}