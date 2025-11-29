-- Insert currencies with Afghani as base currency
INSERT OR REPLACE INTO Currencies (Id, Code, Name, Symbol, IsActive, IsBaseCurrency, CurrentExchangeRate, LastUpdated, CreatedAt, UpdatedAt) VALUES
(1, 'AFN', 'Afghan Afghani', '؋', 1, 1, '1.0', datetime('now'), datetime('now'), datetime('now')),
(2, 'USD', 'US Dollar', '$', 1, 0, '71.4', datetime('now'), datetime('now'), datetime('now')),
(3, 'IRR', 'Iranian Rial', '﷼', 1, 0, '0.0017', datetime('now'), datetime('now'), datetime('now')),
(4, 'CNY', 'Chinese Yuan', '¥', 1, 0, '10.0', datetime('now'), datetime('now'), datetime('now')),
(5, 'PKR', 'Pakistani Rupee', '₨', 1, 0, '0.26', datetime('now'), datetime('now'), datetime('now'));

-- Insert exchange rates to Afghani (how much AFN you get for 1 unit of foreign currency)
INSERT OR REPLACE INTO CurrencyExchangeRates (Id, CurrencyId, RateToAfghani, Date, EffectiveDate, IsActive, Source, CreatedAt, UpdatedAt) VALUES
-- USD to AFN (1 USD = 71.4 AFN)
(1, 2, '71.4', date('now'), datetime('now'), 1, 'Initial', datetime('now'), datetime('now')),
-- IRR to AFN (1 IRR = 0.0017 AFN)
(2, 3, '0.0017', date('now'), datetime('now'), 1, 'Initial', datetime('now'), datetime('now')),
-- CNY to AFN (1 CNY = 10.0 AFN)
(3, 4, '10.0', date('now'), datetime('now'), 1, 'Initial', datetime('now'), datetime('now')),
-- PKR to AFN (1 PKR = 0.26 AFN)
(4, 5, '0.26', date('now'), datetime('now'), 1, 'Initial', datetime('now'), datetime('now'));