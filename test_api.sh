#!/bin/bash

echo "Starting API test..."

# Start the API in background
cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API
dotnet run --urls="http://localhost:5251" > api.log 2>&1 &
API_PID=$!

# Wait for API to start
echo "Waiting for API to start..."
sleep 10

# Test the sale creation
echo "Testing sale creation..."
curl -X POST "http://localhost:5251/api/sales/bulk-create" \
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
  -w "\nHTTP Status: %{http_code}\n" \
  -s

# Kill the API process
kill $API_PID

echo "Test completed. Check api.log for detailed logs."