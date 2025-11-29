using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/core/currency-exchange")]
[SwaggerTag("Currency exchange rate management")]
public class CurrencyExchangeController : ControllerBase
{
    private readonly ICurrencyExchangeService _exchangeService;
    private readonly IUnitOfWork _unitOfWork;

    public CurrencyExchangeController(ICurrencyExchangeService exchangeService, IUnitOfWork unitOfWork)
    {
        _exchangeService = exchangeService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet("current-rates")]
    [SwaggerOperation(Summary = "Get current exchange rates for all currencies")]
    public async Task<ActionResult<IEnumerable<CurrentRateDto>>> GetCurrentRates()
    {
        var currencies = await _unitOfWork.Currencies.GetAllAsync();
        var currentRates = currencies.Where(c => c.IsActive).Select(c => new CurrentRateDto
        {
            CurrencyId = c.Id,
            CurrencyCode = c.Code,
            CurrencyName = c.Name,
            Symbol = c.Symbol,
            IsBaseCurrency = c.IsBaseCurrency,
            CurrentExchangeRate = c.CurrentExchangeRate,
            LastUpdated = c.LastUpdated
        }).OrderBy(c => c.CurrencyCode);
        
        return Ok(currentRates);
    }

    [HttpGet("rate/{currencyId}")]
    [SwaggerOperation(Summary = "Get current exchange rate for currency")]
    public async Task<ActionResult<decimal>> GetExchangeRate(int currencyId)
    {
        try
        {
            var rate = await _exchangeService.GetExchangeRateToAfghaniAsync(currencyId);
            return Ok(rate);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Set exchange rate")]
    public async Task<ActionResult<CurrencyExchangeRateDto>> SetExchangeRate([FromBody] CreateCurrencyExchangeRateDto request)
    {
        var exchangeRate = await _exchangeService.SetExchangeRateAsync(
            request.CurrencyId, 
            request.RateToAfghani, 
            request.Date ?? DateTime.UtcNow,
            request.Source);
        
        var currency = await _unitOfWork.Currencies.GetByIdAsync(request.CurrencyId);
        
        var result = new CurrencyExchangeRateDto
        {
            Id = exchangeRate.Id,
            CurrencyId = exchangeRate.CurrencyId,
            CurrencyCode = currency?.Code ?? "",
            CurrencyName = currency?.Name ?? "",
            RateToAfghani = exchangeRate.RateToAfghani,
            Date = exchangeRate.Date,
            EffectiveDate = exchangeRate.EffectiveDate,
            IsActive = exchangeRate.IsActive,
            Source = exchangeRate.Source
        };
        
        return CreatedAtAction(nameof(GetExchangeRate), 
            new { currencyId = request.CurrencyId }, 
            result);
    }

    [HttpGet("history/{currencyId}")]
    [SwaggerOperation(Summary = "Get exchange rate history for currency")]
    public async Task<ActionResult<IEnumerable<CurrencyExchangeRateDto>>> GetExchangeRateHistory(int currencyId)
    {
        var history = await _exchangeService.GetExchangeRateHistoryAsync(currencyId);
        var currency = await _unitOfWork.Currencies.GetByIdAsync(currencyId);
        
        var result = history.Select(h => new CurrencyExchangeRateDto
        {
            Id = h.Id,
            CurrencyId = h.CurrencyId,
            CurrencyCode = currency?.Code ?? "",
            CurrencyName = currency?.Name ?? "",
            RateToAfghani = h.RateToAfghani,
            Date = h.Date,
            EffectiveDate = h.EffectiveDate,
            IsActive = h.IsActive,
            Source = h.Source
        }).OrderByDescending(h => h.Date);
        
        return Ok(result);
    }
}