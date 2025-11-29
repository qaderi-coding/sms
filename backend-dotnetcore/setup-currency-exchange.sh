#!/bin/bash

echo "Setting up Currency Exchange System..."

# Navigate to API directory
cd ShopManagementSystem.API

# Add migration for currency exchange
echo "Adding migration for currency exchange..."
dotnet ef migrations add AddCurrencyExchange

# Update database
echo "Updating database..."
dotnet ef database update

# Seed currency data
echo "Seeding currency data..."
sqlite3 ShopManagementSystem.db < ../seed-currencies.sql

echo "Currency Exchange System setup completed!"
echo ""
echo "Available currencies:"
echo "1. AFN - Afghan Afghani (Base Currency)"
echo "2. USD - US Dollar"
echo "3. IRR - Iranian Rial"
echo "4. CNY - Chinese Yuan"
echo "5. PKR - Pakistani Rupee"
echo ""
echo "You can now:"
echo "1. Set daily exchange rates using the API"
echo "2. Create sales/purchases in any currency"
echo "3. View exchange rate history"
echo "4. Convert amounts between currencies"
echo ""
echo "Test the API using: test-currency-exchange.http"