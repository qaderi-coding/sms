from rest_framework import serializers
from .models import Sale, SaleItem

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    is_return = serializers.ReadOnlyField()
    sale_type = serializers.ReadOnlyField()
    
    class Meta:
        model = Sale
        fields = '__all__'

# Bulk operation serializers
class BulkSaleItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(help_text="Product ID")
    quantity = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Item quantity")
    unit_price_entered = serializers.DecimalField(max_digits=12, decimal_places=2, help_text="Price per unit")
    
    # Optional item-level fields
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, required=False, help_text="Item discount amount")
    tax_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, required=False, help_text="Item tax amount")
    notes = serializers.CharField(max_length=200, required=False, help_text="Item notes")

class BulkSaleCreateSerializer(serializers.Serializer):
    # Sale fields
    customer_id = serializers.IntegerField(help_text="Customer ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Sale currency")
    total_entered = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, help_text="Total amount (auto-calculated if not provided)")
    status = serializers.ChoiceField(choices=['unpaid', 'partial', 'paid'], default='unpaid', required=False, help_text="Payment status")
    
    # Transaction fields
    notes = serializers.CharField(max_length=500, required=False, help_text="Sale notes/description")
    
    # Items
    items = BulkSaleItemSerializer(many=True, help_text="List of sale items")
    
    # Optional fields for complete sale representation
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, required=False, help_text="Total discount amount")
    tax_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, required=False, help_text="Total tax amount")
    reference_number = serializers.CharField(max_length=50, required=False, help_text="Reference/Invoice number")
    sale_date = serializers.DateTimeField(required=False, help_text="Sale date (defaults to now)")

class BulkSaleReturnSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField(help_text="Customer ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    items = BulkSaleItemSerializer(many=True, help_text="List of return items")
    notes = serializers.CharField(max_length=500, required=False, help_text="Return reason")

class SaleResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    sale_id = serializers.IntegerField()
    transaction_id = serializers.IntegerField()
    total_entered = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_base = serializers.DecimalField(max_digits=12, decimal_places=2)
    exchange_rate = serializers.DecimalField(max_digits=12, decimal_places=4)
    currency = serializers.CharField()
    status = serializers.CharField()
    customer_name = serializers.CharField()
    items_count = serializers.IntegerField()
    created_at = serializers.DateTimeField()

class SaleAdjustmentSerializer(serializers.Serializer):
    original_sale_id = serializers.IntegerField(help_text="Original sale ID to adjust")
    customer_id = serializers.IntegerField(help_text="Customer ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="New total amount")
    reason = serializers.CharField(max_length=500, help_text="Adjustment reason")
    items = BulkSaleItemSerializer(many=True, help_text="Adjusted items")

class ReturnAdjustmentSerializer(serializers.Serializer):
    original_return_id = serializers.IntegerField(help_text="Original return ID to adjust")
    customer_id = serializers.IntegerField(help_text="Customer ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="New return amount")
    reason = serializers.CharField(max_length=500, help_text="Adjustment reason")
    items = BulkSaleItemSerializer(many=True, help_text="Adjusted return items")

class CreateOrUpdateSaleSerializer(serializers.Serializer):
    sale_id = serializers.IntegerField(required=False, help_text="Sale ID for update (optional for create)")
    customer_id = serializers.IntegerField(help_text="Customer ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Total amount")
    status = serializers.ChoiceField(choices=['unpaid', 'partial', 'paid'], default='unpaid', required=False)
    notes = serializers.CharField(max_length=500, required=False, help_text="Sale notes")
    items = BulkSaleItemSerializer(many=True, help_text="Sale items")

class CreateOrUpdateResponseSerializer(serializers.Serializer):
    action = serializers.CharField(help_text="Action performed: created, adjusted, no_change")
    sale_id = serializers.IntegerField()
    message = serializers.CharField(required=False)
    transaction_id = serializers.IntegerField(required=False)
    adjustment_transaction_id = serializers.IntegerField(required=False)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    adjustment_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    new_total = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)