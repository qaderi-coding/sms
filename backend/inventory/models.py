from django.db import models
from django.utils import timezone

class Unit(models.Model):
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Company(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class BikeModel(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='bike_models')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} {self.name}"

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, related_name='products')
    bike_model = models.ForeignKey(BikeModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    base_unit = models.ForeignKey(Unit, on_delete=models.PROTECT, related_name='products')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        model_name = self.bike_model.name if self.bike_model else ""
        return f"{self.name} ({model_name})"

class ProductUnitConversion(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='unit_conversions')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    factor = models.DecimalField(max_digits=12, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'unit')

    def __str__(self):
        return f"{self.product.name} | {self.unit.symbol} x {self.factor}"

class ProductItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='items')
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='AFN')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} | Stock: {self.quantity} {self.product.base_unit.symbol}"

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