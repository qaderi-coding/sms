#!/bin/bash

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

PORT=$((5000 + RANDOM % 1000))
echo "Testing PaymentStatus API on port $PORT..."

# Start API in background
dotnet run --urls="http://localhost:$PORT" > payment_test.log 2>&1 &
API_PID=$!

sleep 8

echo "1. Testing GET all payment statuses..."
GET_RESPONSE=$(curl -s "http://localhost:$PORT/api/core/payment-status")
echo "GET Response: $GET_RESPONSE"

echo -e "\n2. Testing GET active payment statuses..."
ACTIVE_RESPONSE=$(curl -s "http://localhost:$PORT/api/core/payment-status/active")
echo "Active Response: $ACTIVE_RESPONSE"

echo -e "\n3. Testing POST new payment status..."
POST_RESPONSE=$(curl -X POST "http://localhost:$PORT/api/core/payment-status" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST",
    "name": "Test Status",
    "description": "Test payment status",
    "isActive": true,
    "sortOrder": 99
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)
echo "POST Response: $POST_RESPONSE"

# Kill the API process
kill $API_PID 2>/dev/null

if [[ $GET_RESPONSE == *"id"* ]] && [[ $POST_RESPONSE == *"HTTP_STATUS:201"* ]]; then
    echo -e "\n✅ SUCCESS: PaymentStatus API is working correctly!"
    exit 0
else
    echo -e "\n❌ ERROR: PaymentStatus API test failed"
    echo "Check payment_test.log for details:"
    tail -10 payment_test.log
    exit 1
fi