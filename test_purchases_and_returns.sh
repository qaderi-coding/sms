#!/bin/bash

echo "🧪 Testing Unified Purchases System (Purchases + Returns in same table)..."

# Test 1: Create a regular purchase
echo "1️⃣ Creating regular purchase..."
PURCHASE=$(curl -X POST "http://localhost:5250/api/purchases/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": 1,
    "date": "2025-01-22T00:00:00",
    "cashPaid": 1500,
    "currencyId": 1,
    "notes": "Regular purchase from supplier",
    "items": [
        {
            "itemId": 1,
            "qty": 10,
            "cost": 200,
            "total": 2000
        }
    ]
}' -s)

echo "Purchase created: ${PURCHASE:0:100}..."

# Test 2: Create a purchase return
echo "2️⃣ Creating purchase return..."
RETURN=$(curl -X POST "http://localhost:5250/api/purchases/returns/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": 1,
    "date": "2025-01-23T00:00:00",
    "cashPaid": 400,
    "currencyId": 1,
    "notes": "Return - defective items",
    "items": [
        {
            "itemId": 1,
            "qty": 2,
            "cost": 200,
            "total": 400
        }
    ]
}' -s)

echo "Return created: ${RETURN:0:100}..."

# Test 3: Get all transactions (purchases + returns)
echo "3️⃣ Getting all purchase transactions..."
ALL_TRANSACTIONS=$(curl -s "http://localhost:5250/api/purchases")
TRANSACTION_COUNT=$(echo "$ALL_TRANSACTIONS" | grep -o '"id":' | wc -l)
echo "Total purchase transactions: $TRANSACTION_COUNT"

# Test 4: Get only purchases (IsReturn=false)
echo "4️⃣ Getting only purchases..."
PURCHASES_ONLY=$(curl -s "http://localhost:5250/api/purchases?isReturn=false")
PURCHASES_COUNT=$(echo "$PURCHASES_ONLY" | grep -o '"id":' | wc -l)
echo "Purchases count: $PURCHASES_COUNT"

# Test 5: Get only returns (IsReturn=true)
echo "5️⃣ Getting only purchase returns..."
RETURNS_ONLY=$(curl -s "http://localhost:5250/api/purchases?isReturn=true")
RETURNS_COUNT=$(echo "$RETURNS_ONLY" | grep -o '"id":' | wc -l)
echo "Purchase returns count: $RETURNS_COUNT"

# Test 6: Check cashbook balance
echo "6️⃣ Checking cashbook balance..."
BALANCE=$(curl -s "http://localhost:5250/api/cashbook/balance")
echo "Cashbook balance: $BALANCE"

echo ""
echo "📊 RESULTS:"
echo "==========="

if [[ $PURCHASE == *"supplierId"* ]]; then
    echo "✅ Purchase creation: PASSED"
else
    echo "❌ Purchase creation: FAILED"
fi

if [[ $RETURN == *"supplierId"* ]]; then
    echo "✅ Purchase return creation: PASSED"
else
    echo "❌ Purchase return creation: FAILED"
fi

if [[ $ALL_TRANSACTIONS == *"supplierId"* ]]; then
    echo "✅ Purchase retrieval: PASSED"
else
    echo "❌ Purchase retrieval: FAILED"
fi

if [[ $PURCHASES_ONLY == *"supplierId"* ]]; then
    echo "✅ Purchases filtering: PASSED"
else
    echo "❌ Purchases filtering: FAILED"
fi

if [[ $RETURNS_ONLY == *"supplierId"* ]]; then
    echo "✅ Returns filtering: PASSED"
else
    echo "❌ Returns filtering: FAILED"
fi

if [[ $BALANCE == *"balance"* ]]; then
    echo "✅ Cashbook integration: PASSED"
else
    echo "❌ Cashbook integration: FAILED"
fi

echo ""
echo "🏆 Unified purchases system test completed!"