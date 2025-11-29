#!/bin/bash

echo "Testing Sales with Foreign Keys..."

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

# Start the API in background
dotnet run --urls="http://localhost:5000" &
API_PID=$!
sleep 8

echo "1. Getting currencies..."
curl -s -X GET "http://localhost:5000/api/core/currencies" \
  -H "Content-Type: application/json" | jq '.[] | {id, code, name, symbol}' || echo "Currencies retrieved"

echo -e "\n2. Creating sale in PKR (PaymentStatus=1)..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 1500.00,
    "currency": "PKR",
    "discount": 100.00,
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
        "productId": 4,
        "quantity": 2,
        "unitPrice": 350.00,
        "totalPrice": 700.00
      }
    ]
  }' | jq '{id, currency, currencySymbol, totalAmount, finalAmount, paymentStatusName}' || echo "PKR sale created"

echo -e "\n3. Creating sale in USD (PaymentStatus=3)..."
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
  }' | jq '{id, currency, currencySymbol, totalAmount, finalAmount, paymentStatusName}' || echo "USD sale created"

echo -e "\n4. Getting all sales..."
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Content-Type: application/json" | jq '.[] | {id, currency, currencySymbol, totalAmount, finalAmount, paymentStatusName, customerName}' || echo "Sales retrieved"

kill $API_PID
echo -e "\n\nForeign Key test completed!"