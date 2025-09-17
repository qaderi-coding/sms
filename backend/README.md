# Shop Management System for Spare Parts Shop

## Introduction

The goal of this system is to **digitally manage the operations** of a spare parts shop, providing clear **financial insights, sales, purchases, loans, and multi-currency handling**. The system is intended for a **small shop** with simple bookkeeping but robust enough to track **profit, expenses, loans, and daily withdrawals**.

---

## Database Schema

### Core Tables

#### Currency

- `code` (PK): Currency code (AFN, USD, PKR, CNY)
- `name`: Currency name
- `symbol`: Currency symbol
- `created_at`: Creation timestamp

#### ExchangeRate

- `from_currency` (FK): Source currency
- `to_currency` (FK): Target currency
- `rate`: Exchange rate value
- `date`: Rate date
- `created_at`: Creation timestamp

#### Transaction (Central Ledger)

- `type`: Transaction type (sale, purchase, payment_received, etc.)
- `party_type`: Party involved (customer, supplier, owner, none)
- `party_id`: ID of the party
- `entered_amount`: Original amount entered
- `entered_currency`: Original currency
- `exchange_rate_to_base`: Rate to AFN
- `amount_base`: Amount in AFN base currency
- `notes`: Transaction notes
- `created_at`: Transaction timestamp

### Inventory Tables

#### Unit

- `name`: Unit name (Piece, Kilo, Carton)
- `symbol`: Unit symbol (pc, kg, ctn)
- `created_at`: Creation timestamp

#### Category

- `name`: Category name
- `description`: Category description
- `created_at`: Creation timestamp

#### Company

- `name`: Company/brand name
- `country`: Company country
- `created_at`: Creation timestamp

#### BikeModel

- `company` (FK): Company reference
- `name`: Model name (C70CC, C125CC)
- `description`: Model description
- `created_at`: Creation timestamp

#### Product

- `name`: Product name
- `category` (FK): Product category
- `company` (FK): Product company
- `bike_model` (FK): Compatible bike model
- `base_unit` (FK): Base unit for stock
- `description`: Product description
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

#### ProductUnitConversion

- `product` (FK): Product reference
- `unit` (FK): Unit reference
- `factor`: Conversion factor
- `created_at`: Creation timestamp

#### ProductItem

- `product` (FK): Product reference
- `quantity`: Stock quantity
- `purchase_price`: Purchase price
- `currency`: Price currency
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Party Tables

#### Customer

- `name`: Customer name
- `phone`: Phone number
- `address`: Customer address
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

#### Supplier

- `name`: Supplier name
- `phone`: Phone number
- `address`: Supplier address
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Transaction Tables

#### Sale

- `transaction` (OneToOne): Transaction reference
- `customer` (FK): Customer reference
- `total_entered`: Total in entered currency
- `currency`: Sale currency
- `exchange_rate_to_base`: Rate to AFN
- `total_base`: Total in AFN
- `status`: Payment status (unpaid, partial, paid)
- `created_at`: Creation timestamp

#### SaleItem

- `sale` (FK): Sale reference
- `product` (FK): Product reference
- `quantity`: Item quantity
- `unit_price_entered`: Price in entered currency
- `currency`: Item currency
- `unit_price_base`: Price in AFN

#### Purchase

- `transaction` (OneToOne): Transaction reference
- `supplier` (FK): Supplier reference
- `total_entered`: Total in entered currency
- `currency`: Purchase currency
- `exchange_rate_to_base`: Rate to AFN
- `total_base`: Total in AFN
- `status`: Payment status (unpaid, partial, paid)
- `created_at`: Creation timestamp

#### PurchaseItem

- `purchase` (FK): Purchase reference
- `product` (FK): Product reference
- `quantity`: Item quantity
- `unit_price_entered`: Price in entered currency
- `currency`: Item currency
- `unit_price_base`: Price in AFN

#### Payment

- `transaction` (OneToOne): Transaction reference
- `party_type`: Party type (customer, supplier)
- `party_id`: Party ID
- `entered_amount`: Amount in entered currency
- `entered_currency`: Payment currency
- `exchange_rate_to_base`: Rate to AFN
- `amount_base`: Amount in AFN
- `method`: Payment method (cash, bank, transfer)
- `created_at`: Creation timestamp

#### Loan

- `transaction` (OneToOne): Transaction reference
- `party_type`: Party type (customer, supplier)
- `party_id`: Party ID
- `entered_amount`: Amount in entered currency
- `entered_currency`: Loan currency
- `exchange_rate_to_base`: Rate to AFN
- `amount_base`: Amount in AFN
- `status`: Loan status (active, closed)
- `created_at`: Creation timestamp

#### Expense

- `transaction` (OneToOne): Transaction reference
- `category`: Expense category (transport, commission, rent, salary, misc)
- `entered_amount`: Amount in entered currency
- `entered_currency`: Expense currency
- `exchange_rate_to_base`: Rate to AFN
- `amount_base`: Amount in AFN
- `created_at`: Creation timestamp

---

# 📘 Shop Management System – User Stories & Object Structures

## 🧑‍💼 User Stories

### 1. Customer Management

- As a shop owner, I want to **create, update, and view customer records** so I can track who buys items.
- As a shop owner, I want to **assign contact details to customers** so I can reach them when needed.

### 2. Supplier Management

- As a shop owner, I want to **register suppliers** so I can record from whom I purchase items.
- As a shop owner, I want to **update supplier details** so I can maintain up-to-date records.

### 3. Product & Stock Management

- As a shop owner, I want to **add products with details (name, category, unit, price, stock)** so I can manage my inventory.
- As a shop owner, I want to **track available stock** so I know when to reorder.
- As a shop owner, I want to **update stock automatically when sales, purchases, or returns happen** so my inventory is always correct.

### 4. Sales Management

- As a shop owner, I want to **create a sale record** with items so I can track what is sold.
- As a shop owner, I want to **apply discounts and taxes** so I can calculate the correct total.
- As a shop owner, I want to **view a sale history** so I can see daily, weekly, or monthly performance.

### 5. Purchase Management

- As a shop owner, I want to **record purchases from suppliers** with items so I can track incoming stock.
- As a shop owner, I want to **add discounts, taxes, and expenses to purchases** so I know the real cost.
- As a shop owner, I want to **view purchase history** so I can analyze expenses.

### 6. Returns Management

- As a shop owner, I want to **record customer returns (sale return)** so I can adjust stock and accounts.
- As a shop owner, I want to **record supplier returns (purchase return)** so I can return defective goods.
- As a shop owner, I want to **track reasons for returns** so I can avoid repeated issues.

### 7. Payments & Finance

- As a shop owner, I want to **record payments from customers** so I can track balances.
- As a shop owner, I want to **record payments to suppliers** so I can manage debts.
- As a shop owner, I want to **support multiple currencies** so I can handle foreign transactions.

### 8. Reporting

- As a shop owner, I want to **view sales, purchase, and return reports** so I can understand business performance.
- As a shop owner, I want to **generate profit and loss reports** so I can track earnings.
- As a shop owner, I want to **analyze top-selling products** so I can stock better.

---

## 📦 Object Structures

### 🛒 Sale

```json
{
  "sale_id": "UUID / AutoIncrement",
  "date": "2025-09-15T10:30:00Z",
  "customer_id": "UUID",
  "total_amount": 500.0,
  "discount": 20.0,
  "tax": 30.0,
  "net_amount": 510.0,
  "currency": "USD",
  "items": [
    {
      "sale_item_id": "UUID",
      "product_id": "UUID",
      "quantity": 2,
      "unit_price": 100.0,
      "discount": 10.0,
      "subtotal": 190.0
    },
    {
      "sale_item_id": "UUID",
      "product_id": "UUID",
      "quantity": 3,
      "unit_price": 120.0,
      "discount": 10.0,
      "subtotal": 350.0
    }
  ],
  "created_at": "2025-09-15T10:35:00Z",
  "updated_at": "2025-09-15T11:00:00Z"
}
```
