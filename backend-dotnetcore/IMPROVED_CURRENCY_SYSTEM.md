# Improved Currency Exchange System

## Overview
The currency exchange system has been enhanced to be more flexible and accurate. Instead of being USD-centric, it now properly handles Afghan Afghani (AFN) as the base currency and stores the actual exchange rate used for each transaction.

## Key Improvements

### 1. Dynamic Exchange Rate Storage
- **ExchangeRateUsed**: Stores the actual exchange rate used in each transaction
- **AmountInBaseCurrency**: Stores the converted amount in base currency (AFN)
- **CurrentExchangeRate**: Each currency maintains its current exchange rate to AFN

### 2. Simplified Exchange Rate Model
- Only stores rates TO Afghani (base currency)
- Single currency selection with rate to AFN
- Date tracking for historical rates
- Automatic currency rate updates

### 3. Transaction Accuracy
- Records the exact exchange rate used at transaction time
- Converts all amounts to base currency for reporting
- Maintains original currency and amount for reference

## Database Schema Changes

### Updated Transaction Table
```sql
-- Old fields
ExchangeRateToUsd DECIMAL
AmountUsd DECIMAL

-- New fields
ExchangeRateUsed DECIMAL        -- Rate used for this specific transaction
AmountInBaseCurrency DECIMAL    -- Amount converted to AFN
```

### Updated Currency Table
```sql
-- Old field
ExchangeRateToUsd DECIMAL

-- New field
CurrentExchangeRate DECIMAL     -- Current rate to AFN for this currency
```

### Enhanced CurrencyExchangeRate Table
```sql
CurrencyId INTEGER              -- Foreign currency ID
RateToAfghani DECIMAL          -- How much AFN for 1 unit of this currency
Date DATE                      -- Date of the rate (for daily tracking)
EffectiveDate DATETIME         -- Exact time when rate becomes effective
```

## API Endpoints

### Exchange Rate Management
- `GET /api/core/currency-exchange/rate/{currencyId}` - Get rate to AFN
- `POST /api/core/currency-exchange/rate` - Set rate to AFN
- `GET /api/core/currency-exchange/current-rates` - Get all current rates
- `POST /api/core/currency-exchange/bulk-update` - Update multiple rates

### Currency Conversion
- `GET /api/core/currency-exchange/convert-to-afghani` - Convert to AFN
- `GET /api/core/currency-exchange/convert-from-afghani` - Convert from AFN

## Usage Examples

### Setting Exchange Rates
```json
POST /api/core/currency-exchange/rate
{
  "currencyId": 2,              // USD
  "rateToAfghani": 71.4,        // 1 USD = 71.4 AFN
  "date": "2024-01-15",
  "source": "Central Bank"
}
```

### Bulk Rate Update
```json
POST /api/core/currency-exchange/bulk-update
{
  "rates": {
    "USD": 71.4,                // 1 USD = 71.4 AFN
    "IRR": 0.0017,              // 1 IRR = 0.0017 AFN
    "CNY": 10.0,                // 1 CNY = 10.0 AFN
    "PKR": 0.26                 // 1 PKR = 0.26 AFN
  },
  "date": "2024-01-15",
  "source": "Daily Market Rate"
}
```

### Transaction Processing
When a sale is created in USD:
1. System gets current USD to AFN rate (e.g., 71.4)
2. Converts sale amount to AFN (e.g., $100 = 7,140 AFN)
3. Stores in transaction:
   - `OriginalAmount`: 100 (USD)
   - `ExchangeRateUsed`: 71.4
   - `AmountInBaseCurrency`: 7140 (AFN)
4. Updates USD currency's `CurrentExchangeRate` to 71.4

## Benefits

### 1. Accuracy
- Exact exchange rate used is preserved for each transaction
- No confusion about which currency rate was applied
- Historical accuracy maintained

### 2. Flexibility
- Works with any currency as the transaction currency
- Base currency (AFN) used for all reporting and analytics
- Easy to add new currencies

### 3. Simplicity
- Single direction rates (to AFN only)
- Clear data model with minimal complexity
- Easy to understand and maintain

### 4. Auditability
- Complete history of exchange rate changes
- Transaction-level rate tracking
- Source attribution for rate changes

## Migration Notes

### Database Changes Required
1. Rename `ExchangeRateToUsd` to `ExchangeRateUsed` in Transactions
2. Rename `AmountUsd` to `AmountInBaseCurrency` in Transactions
3. Rename `ExchangeRateToUsd` to `CurrentExchangeRate` in Currencies
4. Add `Date` column to CurrencyExchangeRates
5. Update foreign key relationships

### Data Migration
1. Convert existing USD-based rates to AFN-based rates
2. Update transaction records with proper base currency amounts
3. Set AFN as base currency (IsBaseCurrency = true)

## Best Practices

### 1. Daily Rate Updates
```bash
# Update rates daily
curl -X POST "http://localhost:5000/api/core/currency-exchange/bulk-update" \
  -H "Content-Type: application/json" \
  -d '{
    "rates": {
      "USD": 71.4,
      "IRR": 0.0017,
      "CNY": 10.0,
      "PKR": 0.26
    },
    "date": "2024-01-15",
    "source": "Central Bank Rate"
  }'
```

### 2. Transaction Reporting
- Use `AmountInBaseCurrency` for all consolidated reports
- Show both original and converted amounts in transaction details
- Use `ExchangeRateUsed` to verify conversion accuracy

### 3. Rate Management
- Set rates with proper dates for historical accuracy
- Use reliable sources and document the source
- Monitor rate changes for significant fluctuations

This improved system provides better accuracy, flexibility, and maintainability while keeping Afghan Afghani as your base currency for all business operations.