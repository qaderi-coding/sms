from django.db import models
from django.utils import timezone

class Currency(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class ExchangeRate(models.Model):
    from_currency = models.ForeignKey(Currency, related_name="rates_from", on_delete=models.CASCADE)
    to_currency = models.ForeignKey(Currency, related_name="rates_to", on_delete=models.CASCADE)
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_currency', 'to_currency', 'date')

class Transaction(models.Model):
    SALE = 'sale'
    PURCHASE = 'purchase'
    PAYMENT_RECEIVED = 'payment_received'
    PAYMENT_MADE = 'payment_made'
    LOAN_GIVEN = 'loan_given'
    LOAN_RECEIVED = 'loan_received'
    LOAN_REPAYMENT_MADE = 'loan_repayment_made'
    LOAN_REPAYMENT_RECEIVED = 'loan_repayment_received'
    EXPENSE = 'expense'
    WITHDRAWAL = 'withdrawal'
    OWNER_DEPOSIT = 'owner_deposit'
    RETURN_SALE = 'return_sale'
    RETURN_PURCHASE = 'return_purchase'
    REFUND = 'refund'
    SALE_ADJUSTMENT = 'sale_adjustment'
    PURCHASE_ADJUSTMENT = 'purchase_adjustment'
    MISC = 'misc'

    TRANSACTION_TYPES = [
        (SALE, 'Sale'),
        (PURCHASE, 'Purchase'),
        (PAYMENT_RECEIVED, 'Payment Received'),
        (PAYMENT_MADE, 'Payment Made'),
        (LOAN_GIVEN, 'Loan Given'),
        (LOAN_RECEIVED, 'Loan Received'),
        (LOAN_REPAYMENT_MADE, 'Loan Repayment Made'),
        (LOAN_REPAYMENT_RECEIVED, 'Loan Repayment Received'),
        (EXPENSE, 'Expense'),
        (WITHDRAWAL, 'Withdrawal'),
        (OWNER_DEPOSIT, 'Owner Deposit'),
        (RETURN_SALE, 'Return Sale'),
        (RETURN_PURCHASE, 'Return Purchase'),
        (REFUND, 'Refund'),
        (SALE_ADJUSTMENT, 'Sale Adjustment'),
        (PURCHASE_ADJUSTMENT, 'Purchase Adjustment'),
        (MISC, 'Miscellaneous'),
    ]

    CUSTOMER = 'customer'
    SUPPLIER = 'supplier'
    OWNER = 'owner'
    NONE = 'none'

    PARTY_TYPES = [
        (CUSTOMER, 'Customer'),
        (SUPPLIER, 'Supplier'),
        (OWNER, 'Owner'),
        (NONE, 'None'),
    ]

    type = models.CharField(max_length=30, choices=TRANSACTION_TYPES)
    party_type = models.CharField(max_length=20, choices=PARTY_TYPES, default=NONE)
    party_id = models.PositiveBigIntegerField(null=True, blank=True)
    entered_amount = models.DecimalField(max_digits=12, decimal_places=2)
    entered_currency = models.CharField(max_length=10)
    exchange_rate_to_base = models.DecimalField(max_digits=12, decimal_places=4, default=1.0)
    amount_base = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_type_display()} | {self.entered_amount} {self.entered_currency} | {self.amount_base} AFN"