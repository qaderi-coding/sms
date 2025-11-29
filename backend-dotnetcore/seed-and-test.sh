#!/bin/bash

echo "Setting up Shop Management System with Authentication..."
cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

# Start the API in background
dotnet run --urls="http://localhost:5000" &
API_PID=$!

# Wait for API to start
sleep 8

echo "1. Resetting and seeding database..."
curl -s -X POST "http://localhost:5000/api/seed/reset" \
  -H "Content-Type: application/json" | head -5

echo -e "\n2. Seeding roles..."
curl -s -X POST "http://localhost:5000/api/auth/seed-roles" \
  -H "Content-Type: application/json"

echo -e "\n3. Registering admin user..."
curl -s -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shop.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }' | head -5

echo -e "\n4. Logging in to get token..."
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shop.com",
    "password": "Admin123!"
  }')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Login successful, token obtained"

echo -e "\n5. Testing authenticated user details..."
curl -s -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | head -5

echo -e "\n6. Creating sale in PKR with authentication..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 1550.00,
    "currency": "PKR",
    "discount": 50.00,
    "paymentStatus": 1,
    "notes": "Authenticated PKR Sale",
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
  }' | head -10

echo -e "\n7. Creating sale in USD with authentication..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "saleDate": "2024-11-17T11:00:00Z",
    "totalAmount": 100.00,
    "currency": "USD",
    "discount": 10.00,
    "paymentStatus": 3,
    "notes": "Authenticated USD Sale",
    "items": [
      {
        "productId": 3,
        "quantity": 1,
        "unitPrice": 100.00,
        "totalPrice": 100.00
      }
    ]
  }' | head -10

echo -e "\n8. Getting all sales with authentication..."
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | head -15

# Stop the API
kill $API_PID
echo -e "\n\nAuthenticated Sales Test Completed!"
echo "Admin user created: admin@shop.com / Admin123!"