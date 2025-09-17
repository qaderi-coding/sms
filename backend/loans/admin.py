from django.contrib import admin
from .models import Loan

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'party_type', 'party_id', 'entered_amount', 'entered_currency', 'status', 'created_at']
    list_filter = ['party_type', 'status', 'entered_currency', 'created_at']
    search_fields = ['party_id']