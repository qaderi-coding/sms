# Shop Management System API

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create superuser:
```bash
python manage.py createsuperuser
```

4. Run server:
```bash
python manage.py runserver
```

## API Endpoints

### Products & Stock
- `GET/POST /api/categories/` - Categories
- `GET/POST /api/products/` - Products
- `GET/POST /api/product-items/` - Product items (stock)

### Customers & Suppliers
- `GET/POST /api/customers/` - Customers
- `GET/POST /api/suppliers/` - Suppliers

### Transactions
- `GET/POST /api/transactions/` - All transactions
- `GET/POST /api/sales/` - Sales
- `POST /api/sales/create_sale/` - Create sale with items
- `GET/POST /api/purchases/` - Purchases
- `POST /api/purchases/create_purchase/` - Create purchase with items
- `GET/POST /api/expenses/` - Expenses
- `GET/POST /api/loans/` - Loans
- `GET/POST /api/payments/` - Payments

### Currency & Exchange
- `GET/POST /api/currencies/` - Currencies
- `GET/POST /api/exchange-rates/` - Exchange rates

### Stock Management
- `GET/POST /api/stock-movements/` - Stock movements

## Example Usage

### Create Sale
```json
POST /api/sales/create_sale/
{
  "customer": 1,
  "total_amount": 100.00,
  "currency": "USD",
  "exchange_rate_to_usd": 1.0,
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "unit_price": 50.00,
      "currency": "USD"
    }
  ]
}
```

### Create Purchase
```json
POST /api/purchases/create_purchase/
{
  "supplier": 1,
  "total_amount": 200.00,
  "currency": "USD",
  "exchange_rate_to_usd": 1.0,
  "items": [
    {
      "product": 1,
      "quantity": 10,
      "unit_price": 20.00,
      "currency": "USD"
    }
  ]
}
```