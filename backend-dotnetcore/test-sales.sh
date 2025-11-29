#!/bin/bash

echo "Testing Sales API with Foreign Keys..."
cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

# Remove old database and create fresh one
rm -f ShopManagementSystem.db

# Start the API in background
dotnet run --urls="http://localhost:5000" &
API_PID=$!

# Wait for API to start and create database
sleep 8

echo "1. Testing currencies endpoint..."
curl -s -X GET "http://localhost:5000/api/core/currencies" \
  -H "Content-Type: application/json" > /tmp/currencies.json
echo "Currencies response:"
cat /tmp/currencies.json | head -10

echo -e "\n2. Creating sale in PKR with PaymentStatus=1..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 1550.00,
    "currency": "PKR",
    "discount": 50.00,
    "paymentStatus": 1,
    "notes": "PKR Sale with Foreign Keys",
    "items": [
      {
        "productId": 1,
        "quantity": 1,
        "unitPrice": 850.00,
        "totalPrice": 850.00
      },
      {
        "productId": 2,
        "quantity": 1,
        "unitPrice": 750.00,
        "totalPrice": 750.00
      }
    ]
  }' > /tmp/sale1.json
echo "PKR Sale response:"
cat /tmp/sale1.json | head -10

echo -e "\n3. Creating sale in USD with PaymentStatus=3..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "saleDate": "2024-11-17T11:00:00Z",
    "totalAmount": 100.00,
    "currency": "USD",
    "discount": 10.00,
    "paymentStatus": 3,
    "notes": "USD Sale with Foreign Keys",
    "items": [
      {
        "productId": 3,
        "quantity": 1,
        "unitPrice": 100.00,
        "totalPrice": 100.00
      }
    ]
  }' > /tmp/sale2.json
echo "USD Sale response:"
cat /tmp/sale2.json | head -10

echo -e "\n4. Getting all sales..."
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Content-Type: application/json" > /tmp/sales.json
echo "All sales response:"
cat /tmp/sales.json | head -20

# Stop the API
kill $API_PID
echo -e "\n\nForeign Key Sales Test Completed!"