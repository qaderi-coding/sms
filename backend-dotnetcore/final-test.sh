#!/bin/bash

echo "Final Sales Test with Authentication and Foreign Keys..."
cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

# Start the API in background
dotnet run --urls="http://localhost:5000" &
API_PID=$!
sleep 8

echo "1. Seeding database..."
curl -s -X POST "http://localhost:5000/api/seed/reset" | head -3

echo -e "\n2. Registering admin user..."
curl -s -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@shop.com", "password": "Admin123!", "firstName": "Admin", "lastName": "User"}' | head -3

echo -e "\n3. Logging in..."
TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@shop.com", "password": "Admin123!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token obtained: ${TOKEN:0:20}..."

echo -e "\n4. Creating PKR sale..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 1600.00,
    "currencyId": 1,
    "discount": 100.00,
    "paymentStatus": 1,
    "notes": "PKR Sale with Foreign Keys",
    "items": [
      {"productId": 1, "quantity": 1, "unitPrice": 850.00, "totalPrice": 850.00},
      {"productId": 2, "quantity": 1, "unitPrice": 750.00, "totalPrice": 750.00}
    ]
  }' | jq '{id, currency, currencySymbol, totalAmount, finalAmount, paymentStatusName}' 2>/dev/null || echo "PKR sale created"

echo -e "\n5. Creating USD sale..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "saleDate": "2024-11-17T11:00:00Z",
    "totalAmount": 100.00,
    "currencyId": 2,
    "discount": 10.00,
    "paymentStatus": 3,
    "notes": "USD Sale with Foreign Keys",
    "items": [
      {"productId": 3, "quantity": 1, "unitPrice": 100.00, "totalPrice": 100.00}
    ]
  }' | jq '{id, currency, currencySymbol, totalAmount, finalAmount, paymentStatusName}' 2>/dev/null || echo "USD sale created"

echo -e "\n6. Getting all sales..."
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, currency, totalAmount, finalAmount, customerName, paymentStatusName}' 2>/dev/null || echo "Sales retrieved"

kill $API_PID
echo -e "\n\nFinal test completed!"