#!/bin/bash

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

PORT=$((5000 + RANDOM % 1000))
echo "🧪 Testing Sales Bulk Create API on port $PORT (Simple Working Test)..."

# Start API in background
dotnet run --urls="http://localhost:$PORT" > simple_test.log 2>&1 &
API_PID=$!

sleep 10

echo "Testing basic sale creation with the working object structure..."

RESPONSE=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "saleDate": "2025-01-20T00:00:00",
    "totalAmount": 400,
    "currencyId": 1,
    "discount": 0,
    "paymentStatus": 0,
    "notes": "Test sale from automated test",
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

# Kill the API process
kill $API_PID 2>/dev/null

echo ""
echo "📊 TEST RESULT:"
echo "==============="
echo "Response: $RESPONSE"

if [[ $RESPONSE == *"HTTP_STATUS:201"* ]] && [[ $RESPONSE == *"customerId"* ]]; then
    echo ""
    echo "✅ SUCCESS: Sales bulk create is working!"
    echo "🎯 Your object structure is correct and the API is functional."
    echo ""
    echo "📝 WORKING OBJECT STRUCTURE:"
    echo '{'
    echo '    "customerId": 1,'
    echo '    "saleDate": "2025-01-20T00:00:00",'
    echo '    "totalAmount": 400,'
    echo '    "currencyId": 1,'
    echo '    "discount": 0,'
    echo '    "paymentStatus": 0,'
    echo '    "notes": "Your sale notes",'
    echo '    "items": ['
    echo '        {'
    echo '            "productId": 1,'
    echo '            "quantity": 1,'
    echo '            "unitPrice": 400,'
    echo '            "totalPrice": 400'
    echo '        }'
    echo '    ]'
    echo '}'
    exit 0
else
    echo ""
    echo "❌ FAILED: Sales bulk create is not working"
    echo "Check simple_test.log for details:"
    tail -10 simple_test.log
    exit 1
fi