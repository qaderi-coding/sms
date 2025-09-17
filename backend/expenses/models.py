from django.db import models
from django.utils import timezone
from core.models import Transaction

class Expense(models.Model):
    EXPENSE_CATEGORIES = [
        ('transport', 'Transport'),
        ('commission', 'Commission'),
        ('rent', 'Rent'),
        ('salary', 'Salary'),
        ('misc', 'Miscellaneous'),
    ]
    
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='expense')
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES)
    entered_amount = models.DecimalField(max_digits=12, decimal_places=2)
    entered_currency = models.CharField(max_length=10)
    exchange_rate_to_base = models.DecimalField(max_digits=12, decimal_places=4, default=1.0)
    amount_base = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)