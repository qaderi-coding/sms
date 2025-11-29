#!/bin/bash

echo "Setting up Improved Currency Exchange System..."

# Navigate to API directory
cd ShopManagementSystem.API

# Add migration for improved currency exchange
echo "Adding migration for improved currency exchange..."
dotnet ef migrations add ImprovedCurrencyExchange

# Update database
echo "Updating database..."
dotnet ef database update

# Seed currency data
echo "Seeding currency data..."
sqlite3 ShopManagementSystem.db < ../seed-currencies.sql

echo "Improved Currency Exchange System setup completed!"
echo ""
echo "Key Features:"
echo "- Afghan Afghani (AFN) as base currency"
echo "- Dynamic exchange rate tracking"
echo "- Transaction-specific rate storage"
echo "- Date-based rate history"
echo ""
echo "Available currencies:"
echo "1. AFN - Afghan Afghani (Base Currency)"
echo "2. USD - US Dollar"
echo "3. IRR - Iranian Rial"
echo "4. CNY - Chinese Yuan"
echo "5. PKR - Pakistani Rupee"
echo ""
echo "Exchange rates format: 1 Foreign Currency = X AFN"
echo "Example: 1 USD = 71.4 AFN"
echo ""
echo "Transaction fields:"
echo "- ExchangeRateUsed: Rate used for specific transaction"
echo "- AmountInBaseCurrency: Amount converted to AFN"
echo ""
echo "Test the API using: test-currency-exchange.http"