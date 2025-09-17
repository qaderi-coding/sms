from django.db import models
from core.models import Transaction
from parties.models import Customer
from inventory.models import Product

class Sale(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='sale')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales')
    total_entered = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    exchange_rate_to_base = models.DecimalField(max_digits=12, decimal_places=4, default=1.0)
    total_base = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=[('unpaid','Unpaid'),('partial','Partial'),('paid','Paid')], default='unpaid')
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def is_return(self):
        return self.transaction.type == Transaction.RETURN_SALE
    
    @property
    def sale_type(self):
        if self.transaction.type == Transaction.RETURN_SALE:
            return 'return'
        elif self.transaction.type == Transaction.SALE:
            return 'sale'
        else:
            return 'adjustment'
    
    def __str__(self):
        type_str = 'Return' if self.is_return else 'Sale'
        return f"{type_str} #{self.id} - {self.customer.name} - {abs(self.total_base)} AFN"

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price_entered = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10)
    unit_price_base = models.DecimalField(max_digits=12, decimal_places=2)