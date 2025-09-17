from rest_framework import serializers
from .models import Purchase, PurchaseItem

class PurchaseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseItem
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Purchase
        fields = '__all__'

# Bulk operation serializers
class BulkPurchaseItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(help_text="Product ID")
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Item quantity")
    unit_price_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Price per unit")

class BulkPurchaseCreateSerializer(serializers.Serializer):
    supplier_id = serializers.IntegerField(help_text="Supplier ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    items = BulkPurchaseItemSerializer(many=True, help_text="List of purchase items")
    status = serializers.ChoiceField(choices=['unpaid', 'partial', 'paid'], default='unpaid', required=False)
    notes = serializers.CharField(max_length=500, required=False, help_text="Optional notes")

class BulkPurchaseReturnSerializer(serializers.Serializer):
    supplier_id = serializers.IntegerField(help_text="Supplier ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    items = BulkPurchaseItemSerializer(many=True, help_text="List of return items")
    notes = serializers.CharField(max_length=500, required=False, help_text="Return reason")

class PurchaseResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    purchase_id = serializers.IntegerField()
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2)

class PurchaseAdjustmentSerializer(serializers.Serializer):
    original_purchase_id = serializers.IntegerField(help_text="Original purchase ID to adjust")
    supplier_id = serializers.IntegerField(help_text="Supplier ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="New total amount")
    reason = serializers.CharField(max_length=500, help_text="Adjustment reason")
    items = BulkPurchaseItemSerializer(many=True, help_text="Adjusted items")

class PurchaseReturnAdjustmentSerializer(serializers.Serializer):
    original_return_id = serializers.IntegerField(help_text="Original return ID to adjust")
    supplier_id = serializers.IntegerField(help_text="Supplier ID")
    currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Currency code")
    total_entered = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="New return amount")
    reason = serializers.CharField(max_length=500, help_text="Adjustment reason")
    items = BulkPurchaseItemSerializer(many=True, help_text="Adjusted return items")