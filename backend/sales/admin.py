from django.contrib import admin
from .models import Sale, SaleItem

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_entered', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency']
    inlines = [SaleItemInline]

@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    list_display = ['sale', 'product', 'quantity', 'unit_price_entered', 'currency']
    list_filter = ['currency']
    search_fields = ['product__name', 'sale__customer__name']