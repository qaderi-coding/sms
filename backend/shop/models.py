from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    exchange_rate_to_usd = models.DecimalField(max_digits=12, decimal_places=4)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Currency(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class ExchangeRate(models.Model):
    from_currency = models.CharField(max_length=10)
    to_currency = models.CharField(max_length=10)
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('expense', 'Expense'),
        ('loan_given', 'Loan Given'),
        ('loan_received', 'Loan Received'),
        ('loan_repayment_made', 'Loan Repayment Made'),
        ('loan_repayment_received', 'Loan Repayment Received'),
        ('payment_received', 'Payment Received'),
        ('payment_made', 'Payment Made'),
        ('withdrawal', 'Withdrawal'),
        ('return_sale', 'Return Sale'),
        ('return_purchase', 'Return Purchase'),
    ]
    
    PARTY_CHOICES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
        ('owner', 'Owner'),
        ('none', 'None'),
    ]

    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    party_type = models.CharField(max_length=10, choices=PARTY_CHOICES)
    party_id = models.IntegerField(null=True, blank=True)
    original_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    exchange_rate_to_usd = models.DecimalField(max_digits=12, decimal_places=4)
    amount_usd = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Sale(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)

class Purchase(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('transport', 'Transport'),
        ('commission', 'Commission'),
        ('rent', 'Rent'),
        ('salary', 'Salary'),
        ('misc', 'Miscellaneous'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

class Loan(models.Model):
    PARTY_CHOICES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    party_type = models.CharField(max_length=10, choices=PARTY_CHOICES)
    party_id = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    PARTY_CHOICES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
    ]
    
    METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bank', 'Bank'),
        ('transfer', 'Transfer'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    party_type = models.CharField(max_length=10, choices=PARTY_CHOICES)
    party_id = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

class StockMovement(models.Model):
    TYPE_CHOICES = [
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('return_sale', 'Return Sale'),
        ('return_purchase', 'Return Purchase'),
    ]

    product_item = models.ForeignKey(ProductItem, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)