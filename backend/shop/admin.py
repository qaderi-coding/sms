from django.contrib import admin
from .models import *

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'category', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'sku']

@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'purchase_price', 'currency', 'quantity']
    list_filter = ['currency']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'created_at']
    search_fields = ['name', 'phone']

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'created_at']
    search_fields = ['name', 'phone']

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'symbol']

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ['from_currency', 'to_currency', 'rate', 'date']
    list_filter = ['from_currency', 'to_currency', 'date']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['type', 'party_type', 'original_amount', 'currency', 'created_at']
    list_filter = ['type', 'party_type', 'currency']

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency']
    inlines = [SaleItemInline]

class PurchaseItemInline(admin.TabularInline):
    model = PurchaseItem
    extra = 0

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'supplier', 'total_amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency']
    inlines = [PurchaseItemInline]

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['category', 'amount', 'currency', 'created_at']
    list_filter = ['category', 'currency']

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['party_type', 'party_id', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['party_type', 'status', 'currency']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['party_type', 'party_id', 'amount', 'currency', 'method', 'created_at']
    list_filter = ['party_type', 'method', 'currency']

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['product_item', 'transaction_type', 'quantity', 'created_at']
    list_filter = ['transaction_type']