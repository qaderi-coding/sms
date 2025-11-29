#!/bin/bash

echo "🧪 Testing CreditAmount vs PaymentAmount Logic..."

echo "📊 UNDERSTANDING THE DIFFERENCE:"
echo "================================"
echo "CreditAmount = Money OWED (increases debt)"
echo "PaymentAmount = Money PAID (reduces debt)"
echo "Balance = Previous Balance + CreditAmount - PaymentAmount"
echo ""

# Test 1: Credit Sale (CreditAmount > 0, PaymentAmount = 0)
echo "1️⃣ CREDIT SALE - Customer owes us money..."
CREDIT_SALE=$(curl -X POST "http://localhost:5250/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "date": "2025-01-28T00:00:00",
    "cashReceived": 0,
    "currencyId": 1,
    "notes": "Pure credit sale - no cash received",
    "items": [
        {
            "itemId": 1,
            "qty": 1,
            "price": 500,
            "total": 500
        }
    ]
}' -s)

BALANCE_1=$(curl -s "http://localhost:5250/api/Payments/customer/2/balance")
echo "After credit sale: $BALANCE_1"
echo "Expected: CreditAmount=500, PaymentAmount=0, Balance increased by 500"

# Test 2: Customer Payment (CreditAmount = 0, PaymentAmount > 0)
echo ""
echo "2️⃣ CUSTOMER PAYMENT - Customer pays us..."
PAYMENT_1=$(curl -X POST "http://localhost:5250/api/Payments/customer/2" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-29T00:00:00",
    "amount": 300,
    "currencyId": 1,
    "exchangeRate": 1.0,
    "description": "Customer payment"
}' -s)

BALANCE_2=$(curl -s "http://localhost:5250/api/Payments/customer/2/balance")
echo "Payment result: $PAYMENT_1"
echo "After payment: $BALANCE_2"
echo "Expected: CreditAmount=0, PaymentAmount=300, Balance decreased by 300"

# Test 3: Partial Cash Sale (Both CreditAmount > 0 and some cash)
echo ""
echo "3️⃣ PARTIAL CASH SALE - Customer pays some, owes some..."
PARTIAL_SALE=$(curl -X POST "http://localhost:5250/api/sales/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "date": "2025-01-28T00:00:00",
    "cashReceived": 200,
    "currencyId": 1,
    "notes": "Partial payment sale",
    "items": [
        {
            "itemId": 2,
            "qty": 1,
            "price": 800,
            "total": 800
        }
    ]
}' -s)

BALANCE_3=$(curl -s "http://localhost:5250/api/Payments/customer/2/balance")
echo "After partial sale: $BALANCE_3"
echo "Expected: CreditAmount=600 (800-200), PaymentAmount=0, Balance increased by 600"

echo ""
echo "📋 SUPPLIER SIDE - Same Logic, Opposite Direction..."
echo "=================================================="

# Test 4: Credit Purchase (We owe supplier)
echo "4️⃣ CREDIT PURCHASE - We owe supplier money..."
CREDIT_PURCHASE=$(curl -X POST "http://localhost:5250/api/purchases/bulk-create" \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": 2,
    "date": "2025-01-28T00:00:00",
    "cashPaid": 0,
    "currencyId": 1,
    "notes": "Pure credit purchase",
    "items": [
        {
            "itemId": 1,
            "qty": 3,
            "cost": 200,
            "total": 600
        }
    ]
}' -s)

SUPPLIER_BALANCE_1=$(curl -s "http://localhost:5250/api/Payments/supplier/2/balance")
echo "After credit purchase: $SUPPLIER_BALANCE_1"
echo "Expected: CreditAmount=600, PaymentAmount=0, Balance increased by 600"

# Test 5: Supplier Payment (We pay supplier)
echo ""
echo "5️⃣ SUPPLIER PAYMENT - We pay supplier..."
SUPPLIER_PAYMENT=$(curl -X POST "http://localhost:5250/api/Payments/supplier/2" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-29T00:00:00",
    "amount": 250,
    "currencyId": 1,
    "exchangeRate": 1.0,
    "description": "Payment to supplier"
}' -s)

SUPPLIER_BALANCE_2=$(curl -s "http://localhost:5250/api/Payments/supplier/2/balance")
echo "Payment result: $SUPPLIER_PAYMENT"
echo "After payment: $SUPPLIER_BALANCE_2"
echo "Expected: CreditAmount=0, PaymentAmount=250, Balance decreased by 250"

echo ""
echo "📊 SUMMARY - CREDIT vs PAYMENT AMOUNTS:"
echo "======================================="
echo "✅ CreditAmount (Debt Creation):"
echo "   • Credit Sales: Customer owes us money"
echo "   • Credit Purchases: We owe supplier money"
echo "   • INCREASES balance (debt)"
echo ""
echo "✅ PaymentAmount (Debt Reduction):"
echo "   • Customer Payments: Customer pays us"
echo "   • Supplier Payments: We pay supplier"
echo "   • DECREASES balance (debt)"
echo ""
echo "✅ Balance Calculation:"
echo "   New Balance = Old Balance + CreditAmount - PaymentAmount"
echo ""
echo "✅ Transaction Types:"
echo "   • Sale (Credit): CreditAmount > 0, PaymentAmount = 0"
echo "   • Payment: CreditAmount = 0, PaymentAmount > 0"
echo "   • Partial Sale: CreditAmount > 0, PaymentAmount = 0 (cash handled separately)"