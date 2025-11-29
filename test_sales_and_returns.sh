#!/bin/bash

echo "🧪 Testing Sales and Returns API..."

# Test 1: Create a sale
echo "1️⃣ Testing sale creation..."
SALE_RESPONSE=$(curl -X POST "http://localhost:5250/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "date": "2025-01-20T00:00:00",
    "cashReceived": 800,
    "currencyId": 1,
    "notes": "Test sale for return",
    "items": [
        {
            "itemId": 1,
            "qty": 2,
            "price": 500,
            "total": 1000
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

echo "Sale Response: $SALE_RESPONSE"

# Test 2: Create a sales return
echo "2️⃣ Testing sales return creation..."
RETURN_RESPONSE=$(curl -X POST "http://localhost:5250/api/sales/returns/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "date": "2025-01-21T00:00:00",
    "cashRefund": 300,
    "currencyId": 1,
    "notes": "Partial return - defective item",
    "items": [
        {
            "itemId": 1,
            "qty": 1,
            "price": 500,
            "total": 500
        }
    ]
}' \
  -w "HTTP_STATUS:%{http_code}" \
  -s)

echo "Return Response: $RETURN_RESPONSE"

# Test 3: Get all sales
echo "3️⃣ Testing get all sales..."
SALES_LIST=$(curl -s "http://localhost:5250/api/sales")
echo "Sales List: ${SALES_LIST:0:200}..."

# Test 4: Get all returns
echo "4️⃣ Testing get all returns..."
RETURNS_LIST=$(curl -s "http://localhost:5250/api/sales?isReturn=true")
echo "Returns List: ${RETURNS_LIST:0:200}..."

# Test 5: Check cashbook balance
echo "5️⃣ Testing cashbook balance..."
CASHBOOK_BALANCE=$(curl -s "http://localhost:5250/api/cashbook/balance")
echo "Cashbook Balance: $CASHBOOK_BALANCE"

# Results
echo ""
echo "📊 TEST RESULTS:"
echo "================"

if [[ $SALE_RESPONSE == *"HTTP_STATUS:201"* ]]; then
    echo "✅ Sale creation: PASSED"
else
    echo "❌ Sale creation: FAILED"
fi

if [[ $RETURN_RESPONSE == *"HTTP_STATUS:201"* ]]; then
    echo "✅ Sales return creation: PASSED"
else
    echo "❌ Sales return creation: FAILED"
fi

if [[ $SALES_LIST == *"customerId"* ]]; then
    echo "✅ Sales retrieval: PASSED"
else
    echo "❌ Sales retrieval: FAILED"
fi

if [[ $RETURNS_LIST == *"customerId"* ]]; then
    echo "✅ Returns retrieval: PASSED"
else
    echo "❌ Returns retrieval: FAILED"
fi

if [[ $CASHBOOK_BALANCE == *"balance"* ]]; then
    echo "✅ Cashbook integration: PASSED"
else
    echo "❌ Cashbook integration: FAILED"
fi

echo ""
echo "🏆 Integration test completed!"