from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'party_type', 'party_id', 'entered_amount', 'entered_currency', 'method', 'created_at']
    list_filter = ['party_type', 'entered_currency', 'method', 'created_at']
    search_fields = ['party_id']