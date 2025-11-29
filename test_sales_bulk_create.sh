#!/bin/bash

cd /mnt/Windows/Projects/shop_management_system/backend-dotnetcore/ShopManagementSystem.API

PORT=$((5000 + RANDOM % 1000))
echo "🧪 Testing Sales Bulk Create API on port $PORT..."

# Start API in background
dotnet run --urls="http://localhost:$PORT" > sales_test.log 2>&1 &
API_PID=$!

sleep 10

echo "📋 Running comprehensive sales bulk create tests..."

# Test 1: Valid sale with single item
echo "1️⃣ Testing valid sale with single item..."
RESPONSE1=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "date": "2025-01-20T00:00:00",
    "cashReceived": 850,
    "currencyId": 1,
    "notes": "Test sale - single item",
    "items": [
        {
            "itemId": 1,
            "qty": 1,
            "price": 850,
            "total": 850
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

# Test 2: Valid sale with multiple items
echo "2️⃣ Testing valid sale with multiple items..."
RESPONSE2=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "date": "2025-01-20T00:00:00",
    "cashReceived": 2000,
    "currencyId": 1,
    "notes": "Test sale - multiple items",
    "items": [
        {
            "itemId": 1,
            "qty": 1,
            "price": 850,
            "total": 850
        },
        {
            "itemId": 2,
            "qty": 1,
            "price": 1200,
            "total": 1200
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

# Test 3: Valid sale with different currency
echo "3️⃣ Testing valid sale with different currency..."
RESPONSE3=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 3,
    "date": "2025-01-20T00:00:00",
    "cashReceived": 15,
    "currencyId": 2,
    "notes": "Test sale - USD currency",
    "items": [
        {
            "itemId": 3,
            "qty": 1,
            "price": 15,
            "total": 15
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

# Test 4: Invalid sale - missing customer
echo "4️⃣ Testing invalid sale (missing customer)..."
RESPONSE4=$(curl -X POST "http://localhost:$PORT/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 999,
    "date": "2025-01-20T00:00:00",
    "cashReceived": 850,
    "currencyId": 1,
    "notes": "Test sale - invalid customer",
    "items": [
        {
            "itemId": 1,
            "qty": 1,
            "price": 850,
            "total": 850
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

# Test 5: Get all sales to verify creation
echo "5️⃣ Testing GET all sales..."
RESPONSE5=$(curl -s "http://localhost:$PORT/api/sales")

# Kill the API process
kill $API_PID 2>/dev/null

echo ""
echo "📊 TEST RESULTS:"
echo "================"

# Check Test 1
if [[ $RESPONSE1 == *"HTTP_STATUS:201"* ]] && [[ $RESPONSE1 == *"customerId"* ]]; then
    echo "✅ Test 1 PASSED: Single item sale created successfully"
else
    echo "❌ Test 1 FAILED: Single item sale creation failed"
    echo "   Response: $RESPONSE1"
fi

# Check Test 2
if [[ $RESPONSE2 == *"HTTP_STATUS:201"* ]] && [[ $RESPONSE2 == *"customerId"* ]]; then
    echo "✅ Test 2 PASSED: Multiple items sale created successfully"
else
    echo "❌ Test 2 FAILED: Multiple items sale creation failed"
    echo "   Response: $RESPONSE2"
fi

# Check Test 3
if [[ $RESPONSE3 == *"HTTP_STATUS:201"* ]] && [[ $RESPONSE3 == *"customerId"* ]]; then
    echo "✅ Test 3 PASSED: Different currency sale created successfully"
else
    echo "❌ Test 3 FAILED: Different currency sale creation failed"
    echo "   Response: $RESPONSE3"
fi

# Check Test 4 (should fail)
if [[ $RESPONSE4 == *"HTTP_STATUS:500"* ]] || [[ $RESPONSE4 == *"HTTP_STATUS:400"* ]]; then
    echo "✅ Test 4 PASSED: Invalid customer properly rejected"
else
    echo "❌ Test 4 FAILED: Invalid customer should be rejected"
    echo "   Response: $RESPONSE4"
fi

# Check Test 5
if [[ $RESPONSE5 == *"customerId"* ]] && [[ $RESPONSE5 == *"totalAmount"* ]]; then
    echo "✅ Test 5 PASSED: Sales retrieval working"
    SALES_COUNT=$(echo "$RESPONSE5" | grep -o '"id":' | wc -l)
    echo "   📈 Total sales created: $SALES_COUNT"
else
    echo "❌ Test 5 FAILED: Sales retrieval failed"
fi

echo ""
echo "🔍 DETAILED RESPONSES:"
echo "====================="
echo "Test 1 Response: $RESPONSE1"
echo ""
echo "Test 2 Response: $RESPONSE2"
echo ""
echo "Test 3 Response: $RESPONSE3"
echo ""
echo "Test 4 Response: $RESPONSE4"
echo ""
echo "Test 5 Response (first 200 chars): ${RESPONSE5:0:200}..."

# Overall result
PASSED_TESTS=0
if [[ $RESPONSE1 == *"HTTP_STATUS:201"* ]]; then ((PASSED_TESTS++)); fi
if [[ $RESPONSE2 == *"HTTP_STATUS:201"* ]]; then ((PASSED_TESTS++)); fi
if [[ $RESPONSE3 == *"HTTP_STATUS:201"* ]]; then ((PASSED_TESTS++)); fi
if [[ $RESPONSE4 == *"HTTP_STATUS:500"* ]] || [[ $RESPONSE4 == *"HTTP_STATUS:400"* ]]; then ((PASSED_TESTS++)); fi
if [[ $RESPONSE5 == *"customerId"* ]]; then ((PASSED_TESTS++)); fi

echo ""
echo "🏆 FINAL RESULT: $PASSED_TESTS/5 tests passed"

if [ $PASSED_TESTS -eq 5 ]; then
    echo "🎉 ALL TESTS PASSED! Sales bulk create is working perfectly!"
    exit 0
else
    echo "⚠️  Some tests failed. Check sales_test.log for details:"
    tail -20 sales_test.log
    exit 1
fi