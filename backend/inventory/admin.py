from django.contrib import admin
from .models import Unit, Category, Company, BikeModel, Product, ProductUnitConversion, ProductItem, StockMovement

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['name', 'symbol', 'created_at']
    search_fields = ['name', 'symbol']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'created_at']
    search_fields = ['name', 'country']

@admin.register(BikeModel)
class BikeModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'created_at']
    list_filter = ['company']
    search_fields = ['name', 'company__name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'company', 'bike_model', 'base_unit', 'created_at']
    list_filter = ['category', 'company', 'base_unit']
    search_fields = ['name']

@admin.register(ProductUnitConversion)
class ProductUnitConversionAdmin(admin.ModelAdmin):
    list_display = ['product', 'unit', 'factor', 'created_at']
    list_filter = ['unit']
    search_fields = ['product__name']

@admin.register(ProductItem)
class ProductItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity', 'purchase_price', 'currency', 'created_at']
    list_filter = ['currency']
    search_fields = ['product__name']

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['product_item', 'transaction_type', 'quantity', 'created_at']
    list_filter = ['transaction_type']