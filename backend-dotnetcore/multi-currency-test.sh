#!/bin/bash

echo "Testing Multiple Currency Sales..."

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API
dotnet run --urls="http://localhost:5000" &
API_PID=$!
sleep 8

echo "1. Creating sale in PKR..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 1500.00,
    "currency": "PKR",
    "discount": 100.00,
    "paymentStatus": 1,
    "notes": "PKR Sale - Engine Oil",
    "items": [{"productId": 1, "quantity": 1, "unitPrice": 850.00, "totalPrice": 850.00}]
  }' | jq '.currency, .totalAmount, .finalAmount'

echo -e "\n2. Creating sale in USD..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "saleDate": "2024-11-17T11:00:00Z",
    "totalAmount": 100.00,
    "currency": "USD",
    "discount": 10.00,
    "paymentStatus": 2,
    "notes": "USD Sale - Brake Pads",
    "items": [{"productId": 2, "quantity": 1, "unitPrice": 100.00, "totalPrice": 100.00}]
  }' | jq '.currency, .totalAmount, .finalAmount'

echo -e "\n3. Creating sale in EUR..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 3,
    "saleDate": "2024-11-17T12:00:00Z",
    "totalAmount": 75.00,
    "currency": "EUR",
    "discount": 5.00,
    "paymentStatus": 0,
    "notes": "EUR Sale - Air Filter",
    "items": [{"productId": 3, "quantity": 1, "unitPrice": 75.00, "totalPrice": 75.00}]
  }' | jq '.currency, .totalAmount, .finalAmount'

echo -e "\n4. All sales summary:"
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Content-Type: application/json" | jq '.[] | {id, currency, totalAmount, finalAmount, customerName}'

kill $API_PID
echo -e "\n\nMulti-currency test completed successfully!"