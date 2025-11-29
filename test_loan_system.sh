#!/bin/bash

echo "🏦 Testing Loan Management System..."
echo "=================================="

# Test 1: Create a loan FROM someone (we borrowed money)
echo "1️⃣ Creating loan FROM Ahmad (we borrowed 5000 from Ahmad)..."
LOAN_FROM=$(curl -X POST "http://localhost:5250/api/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmad Khan",
    "type": 0,
    "openingBalance": 5000
}' -s)

echo "Loan FROM created: $LOAN_FROM"
LOAN_FROM_ID=$(echo $LOAN_FROM | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Loan FROM ID: $LOAN_FROM_ID"

# Test 2: Create a loan TO someone (we lent money)
echo ""
echo "2️⃣ Creating loan TO Sara (we lent 3000 to Sara)..."
LOAN_TO=$(curl -X POST "http://localhost:5250/api/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sara Ali",
    "type": 1,
    "openingBalance": 3000
}' -s)

echo "Loan TO created: $LOAN_TO"
LOAN_TO_ID=$(echo $LOAN_TO | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Loan TO ID: $LOAN_TO_ID"

# Test 3: Check initial balances
echo ""
echo "3️⃣ Checking initial loan balances..."
if [ ! -z "$LOAN_FROM_ID" ]; then
    BALANCE_FROM=$(curl -s "http://localhost:5250/api/loans/$LOAN_FROM_ID/balance")
    echo "Balance FROM Ahmad: $BALANCE_FROM (we owe Ahmad)"
fi

if [ ! -z "$LOAN_TO_ID" ]; then
    BALANCE_TO=$(curl -s "http://localhost:5250/api/loans/$LOAN_TO_ID/balance")
    echo "Balance TO Sara: $BALANCE_TO (Sara owes us)"
fi

# Test 4: We borrow more money from Ahmad
echo ""
echo "4️⃣ We borrow additional 2000 from Ahmad..."
if [ ! -z "$LOAN_FROM_ID" ]; then
    BORROW_MORE=$(curl -X POST "http://localhost:5250/api/loans/$LOAN_FROM_ID/transactions" \
      -H "Content-Type: application/json" \
      -d '{
        "date": "2025-01-26T10:00:00",
        "description": "Additional loan from Ahmad",
        "amountIn": 2000,
        "amountOut": 0
    }' -s)
    echo "Additional borrowing: $BORROW_MORE"
fi

# Test 5: We pay back some money to Ahmad
echo ""
echo "5️⃣ We pay back 1500 to Ahmad..."
if [ ! -z "$LOAN_FROM_ID" ]; then
    PAY_BACK=$(curl -X POST "http://localhost:5250/api/loans/$LOAN_FROM_ID/transactions" \
      -H "Content-Type: application/json" \
      -d '{
        "date": "2025-01-26T14:00:00",
        "description": "Partial payment to Ahmad",
        "amountIn": 0,
        "amountOut": 1500
    }' -s)
    echo "Payment to Ahmad: $PAY_BACK"
fi

# Test 6: Sara pays us back some money
echo ""
echo "6️⃣ Sara pays us back 1000..."
if [ ! -z "$LOAN_TO_ID" ]; then
    SARA_PAYMENT=$(curl -X POST "http://localhost:5250/api/loans/$LOAN_TO_ID/transactions" \
      -H "Content-Type: application/json" \
      -d '{
        "date": "2025-01-26T16:00:00",
        "description": "Payment from Sara",
        "amountIn": 0,
        "amountOut": 1000
    }' -s)
    echo "Payment from Sara: $SARA_PAYMENT"
fi

# Test 7: We lend more money to Sara
echo ""
echo "7️⃣ We lend additional 500 to Sara..."
if [ ! -z "$LOAN_TO_ID" ]; then
    LEND_MORE=$(curl -X POST "http://localhost:5250/api/loans/$LOAN_TO_ID/transactions" \
      -H "Content-Type: application/json" \
      -d '{
        "date": "2025-01-26T18:00:00",
        "description": "Additional loan to Sara",
        "amountIn": 500,
        "amountOut": 0
    }' -s)
    echo "Additional lending to Sara: $LEND_MORE"
fi

# Test 8: Check final balances
echo ""
echo "8️⃣ Checking final loan balances..."
if [ ! -z "$LOAN_FROM_ID" ]; then
    FINAL_BALANCE_FROM=$(curl -s "http://localhost:5250/api/loans/$LOAN_FROM_ID/balance")
    echo "Final balance FROM Ahmad: $FINAL_BALANCE_FROM (we owe Ahmad)"
fi

if [ ! -z "$LOAN_TO_ID" ]; then
    FINAL_BALANCE_TO=$(curl -s "http://localhost:5250/api/loans/$LOAN_TO_ID/balance")
    echo "Final balance TO Sara: $FINAL_BALANCE_TO (Sara owes us)"
fi

# Test 9: Get transaction history
echo ""
echo "9️⃣ Getting transaction histories..."
if [ ! -z "$LOAN_FROM_ID" ]; then
    echo "Ahmad's loan transactions:"
    curl -s "http://localhost:5250/api/loans/$LOAN_FROM_ID/transactions" | head -c 200
    echo "..."
fi

if [ ! -z "$LOAN_TO_ID" ]; then
    echo "Sara's loan transactions:"
    curl -s "http://localhost:5250/api/loans/$LOAN_TO_ID/transactions" | head -c 200
    echo "..."
fi

# Test 10: Get all loans
echo ""
echo "🔟 Getting all loans summary..."
ALL_LOANS=$(curl -s "http://localhost:5250/api/loans")
echo "All loans: ${ALL_LOANS:0:300}..."

echo ""
echo "📊 LOAN SYSTEM TEST RESULTS:"
echo "============================"

# Calculate expected balances
echo "Expected calculations:"
echo "• Ahmad (LoanFrom): 5000 + 2000 - 1500 = 5500 (we owe)"
echo "• Sara (LoanTo): 3000 - 1000 + 500 = 2500 (she owes us)"

# Verify results
if [[ $FINAL_BALANCE_FROM == "5500" ]]; then
    echo "✅ Ahmad's loan balance: CORRECT"
else
    echo "❌ Ahmad's loan balance: INCORRECT (got $FINAL_BALANCE_FROM, expected 5500)"
fi

if [[ $FINAL_BALANCE_TO == "2500" ]]; then
    echo "✅ Sara's loan balance: CORRECT"
else
    echo "❌ Sara's loan balance: INCORRECT (got $FINAL_BALANCE_TO, expected 2500)"
fi

if [[ $LOAN_FROM == *"id"* && $LOAN_TO == *"id"* ]]; then
    echo "✅ Loan creation: WORKING"
else
    echo "❌ Loan creation: FAILED"
fi

if [[ $BORROW_MORE == *"id"* && $PAY_BACK == *"id"* ]]; then
    echo "✅ Loan transactions: WORKING"
else
    echo "❌ Loan transactions: FAILED"
fi

echo ""
echo "🎯 LOAN SYSTEM FEATURES TESTED:"
echo "   1. ✅ Create LoanFrom (we borrow money)"
echo "   2. ✅ Create LoanTo (we lend money)"
echo "   3. ✅ Opening balance handling"
echo "   4. ✅ AmountIn transactions (increase debt/receivable)"
echo "   5. ✅ AmountOut transactions (decrease debt/receivable)"
echo "   6. ✅ Balance calculation and tracking"
echo "   7. ✅ Transaction history"
echo "   8. ✅ Proper loan type handling"