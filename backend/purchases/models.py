from django.db import models
from core.models import Transaction
from parties.models import Supplier
from inventory.models import Product

class Purchase(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='purchase')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchases')
    total_entered = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    exchange_rate_to_base = models.DecimalField(max_digits=12, decimal_places=4, default=1.0)
    total_base = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=[('unpaid','Unpaid'),('partial','Partial'),('paid','Paid')], default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Purchase #{self.id} | {self.supplier.name} | {self.total_base} AFN"

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price_entered = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    unit_price_base = models.DecimalField(max_digits=12, decimal_places=2)