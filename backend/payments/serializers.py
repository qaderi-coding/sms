from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

# Payment operation serializers
class PaymentCreateSerializer(serializers.Serializer):
    party_type = serializers.ChoiceField(choices=['customer', 'supplier'], help_text="Party type")
    party_id = serializers.IntegerField(help_text="Customer or Supplier ID")
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Payment amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Payment currency")
    method = serializers.ChoiceField(choices=['cash', 'bank', 'transfer'], default='cash', help_text="Payment method")
    notes = serializers.CharField(max_length=500, required=False, help_text="Payment notes")

class PaymentResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    payment_id = serializers.IntegerField()
    amount_entered = serializers.DecimalField(max_digits=10, decimal_places=2)
    amount_base = serializers.DecimalField(max_digits=10, decimal_places=2)