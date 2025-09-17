from django.contrib import admin
from .models import Currency, ExchangeRate, Transaction

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'symbol']

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ['from_currency', 'to_currency', 'rate', 'date']
    list_filter = ['from_currency', 'to_currency', 'date']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['type', 'party_type', 'entered_amount', 'entered_currency', 'created_at']
    list_filter = ['type', 'party_type', 'entered_currency']