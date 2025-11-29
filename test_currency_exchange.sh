#!/bin/bash

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

PORT=$((5000 + RANDOM % 1000))
echo "Testing CurrencyExchange API on port $PORT..."

# Start API in background
dotnet run --urls="http://localhost:$PORT" > currency_test.log 2>&1 &
API_PID=$!

sleep 8

echo "1. Testing GET current rates..."
CURRENT_RESPONSE=$(curl -s "http://localhost:$PORT/api/core/currency-exchange/current-rates")
echo "Current rates: $CURRENT_RESPONSE"

echo -e "\n2. Testing GET exchange rate for currency 1..."
RATE_RESPONSE=$(curl -s "http://localhost:$PORT/api/core/currency-exchange/rate/1")
echo "Rate response: $RATE_RESPONSE"

echo -e "\n3. Testing POST new exchange rate..."
POST_RESPONSE=$(curl -X POST "http://localhost:$PORT/api/core/currency-exchange" \
  -H "Content-Type: application/json" \
  -d '{
    "currencyId": 2,
    "rateToAfghani": 0.015,
    "source": "Test"
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)
echo "POST response: $POST_RESPONSE"

echo -e "\n4. Testing GET history for currency 2..."
HISTORY_RESPONSE=$(curl -s "http://localhost:$PORT/api/core/currency-exchange/history/2")
echo "History response: $HISTORY_RESPONSE"

# Kill the API process
kill $API_PID 2>/dev/null

if [[ $CURRENT_RESPONSE == *"currencyId"* ]] && [[ $POST_RESPONSE == *"HTTP_STATUS:201"* ]]; then
    echo -e "\n✅ SUCCESS: CurrencyExchange API is working correctly!"
    exit 0
else
    echo -e "\n❌ ERROR: CurrencyExchange API test failed"
    echo "Check currency_test.log for details:"
    tail -10 currency_test.log
    exit 1
fi