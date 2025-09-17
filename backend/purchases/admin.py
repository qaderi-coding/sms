from django.contrib import admin
from .models import Purchase, PurchaseItem

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'supplier', 'total_entered', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['supplier__name']

@admin.register(PurchaseItem)
class PurchaseItemAdmin(admin.ModelAdmin):
    list_display = ['purchase', 'product', 'quantity', 'unit_price_entered', 'currency']
    list_filter = ['currency']
    search_fields = ['product__name', 'purchase__supplier__name']