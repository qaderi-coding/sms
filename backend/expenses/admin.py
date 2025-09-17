from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['id', 'category', 'entered_amount', 'entered_currency', 'created_at']
    list_filter = ['category', 'entered_currency', 'created_at']
    search_fields = ['category']