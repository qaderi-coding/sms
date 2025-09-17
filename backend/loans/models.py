from django.db import models
from django.utils import timezone
from core.models import Transaction

class Loan(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='loan')
    party_type = models.CharField(max_length=20, choices=Transaction.PARTY_TYPES)
    party_id = models.PositiveBigIntegerField()
    entered_amount = models.DecimalField(max_digits=12, decimal_places=2)
    entered_currency = models.CharField(max_length=10)
    exchange_rate_to_base = models.DecimalField(max_digits=12, decimal_places=4, default=1.0)
    amount_base = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=[('active','Active'),('closed','Closed')], default='active')
    created_at = models.DateTimeField(default=timezone.now)