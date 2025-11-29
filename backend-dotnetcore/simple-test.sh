#!/bin/bash

echo "Testing Sales API with Multiple Currencies..."

# Start the API in background
cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API
dotnet run --urls="http://localhost:5000" &
API_PID=$!

# Wait for API to start
sleep 8

echo "Creating sale in PKR..."
curl -s -X POST "http://localhost:5000/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2024-11-17T10:00:00Z",
    "totalAmount": 2550.00,
    "currency": "PKR",
    "discount": 50.00,
    "paymentStatus": 1,
    "notes": "Test sale in PKR",
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
        "unitPrice": 1200.00,
        "totalPrice": 1200.00
      }
    ]
  }' > /tmp/sale_response.json

echo "Sale creation response:"
cat /tmp/sale_response.json | head -20

echo -e "\n\nGetting all sales..."
curl -s -X GET "http://localhost:5000/api/sales" \
  -H "Content-Type: application/json" > /tmp/sales_response.json

echo "Sales list response:"
cat /tmp/sales_response.json | head -20

# Stop the API
kill $API_PID
echo -e "\n\nTest completed!"