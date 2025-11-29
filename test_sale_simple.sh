#!/bin/bash

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

# Use a random port to avoid conflicts
PORT=$((5000 + RANDOM % 1000))
echo "Starting API on port $PORT..."

# Start API in background
dotnet run --urls="http://localhost:$PORT" > test.log 2>&1 &
API_PID=$!

# Wait for API to start
sleep 8

# Test the sale creation
echo "Testing sale creation on port $PORT..."
RESPONSE=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2025-01-20T00:00:00",
    "totalAmount": 400,
    "currencyId": 1,
    "discount": 0,
    "paymentStatus": 0,
    "notes": "",
    "items": [
        {
            "productId": 1,
            "quantity": 1,
            "unitPrice": 400,
            "totalPrice": 400
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

echo "Response: $RESPONSE"

# Kill the API process
kill $API_PID 2>/dev/null

# Check if successful
if [[ $RESPONSE == *"HTTP_STATUS:201"* ]]; then
    echo "✅ SUCCESS: Sale created successfully!"
    exit 0
elif [[ $RESPONSE == *"HTTP_STATUS:500"* ]]; then
    echo "❌ ERROR: Internal server error"
    echo "Check test.log for details:"
    tail -20 test.log
    exit 1
else
    echo "❌ UNKNOWN: Unexpected response"
    echo "Check test.log for details:"
    tail -20 test.log
    exit 1
fi