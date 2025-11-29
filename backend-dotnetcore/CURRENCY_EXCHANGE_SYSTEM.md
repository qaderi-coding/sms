# Currency Exchange System

## Overview
The Shop Management System now includes a comprehensive currency exchange system that supports multiple currencies with Afghan Afghani (AFN) as the base currency. The system allows for dynamic exchange rate management and automatic currency conversion in all transactions.

## Features

### 1. Multi-Currency Support
- **Base Currency**: Afghan Afghani (AFN)
- **Supported Currencies**: USD, Iranian Rial (IRR), Chinese Yuan (CNY), Pakistani Rupee (PKR)
- **Extensible**: Easy to add new currencies

### 2. Dynamic Exchange Rate Management
- Set exchange rates between any two currencies
- Historical exchange rate tracking
- Multiple rate sources (Manual, API, Bank, etc.)
- Automatic rate expiration and updates

### 3. Currency Conversion
- Real-time currency conversion
- Direct and cross-currency conversion
- Base currency conversion for reporting
- Date-specific rate lookup

### 4. Transaction Integration
- All sales support multiple currencies
- All purchases support multiple currencies
- Automatic conversion to base currency for reporting
- Currency-specific pricing for products

## API Endpoints

### Currency Management
- `GET /api/core/currencies` - Get all currencies
- `POST /api/core/currencies` - Create new currency
- `PUT /api/core/currencies/{id}` - Update currency
- `DELETE /api/core/currencies/{id}` - Delete currency

### Exchange Rate Management
- `GET /api/core/currency-exchange/rate/{fromId}/{toId}` - Get exchange rate
- `POST /api/core/currency-exchange/rate` - Set exchange rate
- `GET /api/core/currency-exchange/history/{fromId}/{toId}` - Get rate history
- `POST /api/core/currency-exchange/bulk-update` - Update multiple rates
- `GET /api/core/currency-exchange/all-rates` - Get all active rates

### Currency Conversion
- `GET /api/core/currency-exchange/convert` - Convert amount between currencies
- `GET /api/core/currency-exchange/base-currency` - Get base currency

## Database Schema

### Currency Table
```sql
CREATE TABLE Currencies (
    Id INTEGER PRIMARY KEY,
    Code TEXT(3) NOT NULL UNIQUE,
    Name TEXT(100) NOT NULL,
    Symbol TEXT(5),
    IsActive BOOLEAN DEFAULT 1,
    IsBaseCurrency BOOLEAN DEFAULT 0,
    ExchangeRateToUsd DECIMAL,
    LastUpdated DATETIME,
    CreatedAt DATETIME,
    UpdatedAt DATETIME
);
```

### CurrencyExchangeRate Table
```sql
CREATE TABLE CurrencyExchangeRates (
    Id INTEGER PRIMARY KEY,
    FromCurrencyId INTEGER NOT NULL,
    ToCurrencyId INTEGER NOT NULL,
    Rate DECIMAL NOT NULL,
    EffectiveDate DATETIME NOT NULL,
    IsActive BOOLEAN DEFAULT 1,
    Source TEXT(50),
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
    FOREIGN KEY (FromCurrencyId) REFERENCES Currencies(Id),
    FOREIGN KEY (ToCurrencyId) REFERENCES Currencies(Id)
);
```

## Usage Examples

### 1. Setting Daily Exchange Rates
```http
POST /api/core/currency-exchange/bulk-update
{
  "rates": {
    "USD": 0.014,
    "IRR": 590.0,
    "CNY": 0.10,
    "PKR": 3.9
  },
  "source": "Daily Market Rate"
}
```

### 2. Creating Multi-Currency Sale
```http
POST /api/sales/bulk-create
{
  "customerId": 1,
  "currencyId": 2, // USD
  "paymentStatus": 1,
  "saleDate": "2024-01-15T10:00:00Z",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 50.00,
      "totalPrice": 100.00
    }
  ]
}
```

### 3. Converting Currency
```http
GET /api/core/currency-exchange/convert?amount=1000&fromCurrencyId=1&toCurrencyId=2
// Converts 1000 AFN to USD
```

## Business Logic

### Exchange Rate Resolution
1. **Direct Rate**: Look for direct exchange rate between currencies
2. **Reverse Rate**: Use inverse of reverse rate if available
3. **Base Currency**: Convert through base currency if no direct rate exists
4. **Historical Rates**: Use most recent rate before the specified date

### Transaction Processing
1. All transactions store original currency and amount
2. Automatic conversion to base currency for reporting
3. Exchange rate at transaction time is recorded
4. Historical exchange rates preserved for audit

### Currency Conversion Formula
```
ConvertedAmount = OriginalAmount × ExchangeRate
```

For cross-currency conversion:
```
ConvertedAmount = OriginalAmount × (FromCurrency→BaseCurrency) × (BaseCurrency→ToCurrency)
```

## Configuration

### Setting Base Currency
1. Only one currency can be marked as base currency
2. Base currency is typically the local business currency (AFN)
3. All reporting and analytics use base currency
4. Base currency can be changed but affects historical data

### Adding New Currencies
1. Create currency record with unique code
2. Set initial exchange rates to/from base currency
3. Configure cross-rates with major currencies if needed
4. Activate currency for transactions

## Best Practices

### 1. Exchange Rate Management
- Update rates daily or as market conditions change
- Use reliable sources for exchange rates
- Keep historical rates for audit and reporting
- Set appropriate effective dates for rate changes

### 2. Transaction Handling
- Always specify currency for transactions
- Validate currency is active before processing
- Store original currency amounts for reference
- Use consistent rounding rules

### 3. Reporting
- Convert all amounts to base currency for consolidated reports
- Show both original and converted amounts when relevant
- Use exchange rates from transaction date for historical accuracy
- Provide currency conversion details in reports

## Setup Instructions

1. Run the setup script:
   ```bash
   ./setup-currency-exchange.sh
   ```

2. Verify currencies are created:
   ```http
   GET /api/core/currencies
   ```

3. Test currency conversion:
   ```http
   GET /api/core/currency-exchange/convert?amount=1000&fromCurrencyId=1&toCurrencyId=2
   ```

4. Create test transactions in different currencies using the provided test file

## Troubleshooting

### Common Issues
1. **No exchange rate found**: Ensure rates are set between currencies or through base currency
2. **Base currency not set**: Mark one currency as base currency
3. **Inactive currency**: Ensure currency is active before using in transactions
4. **Rate conflicts**: Deactivate old rates when setting new ones

### Error Messages
- `"No exchange rate found between currencies X and Y"`: Set direct rate or rates through base currency
- `"No base currency configured"`: Mark one currency as base currency
- `"Currency with ID 'X' not found"`: Ensure currency exists and is active

## Future Enhancements
- Integration with external exchange rate APIs
- Automatic rate updates from financial data providers
- Currency hedging and risk management features
- Multi-base currency support for international operations
- Real-time rate alerts and notifications