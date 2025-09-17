from rest_framework import serializers
from .models import Loan

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'

# Loan operation serializers
class LoanCreateSerializer(serializers.Serializer):
    party_type = serializers.ChoiceField(choices=['customer', 'supplier'], help_text="Party type")
    party_id = serializers.IntegerField(help_text="Customer or Supplier ID")
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Loan amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Loan currency")
    notes = serializers.CharField(max_length=500, required=False, help_text="Loan notes")

class LoanRepaymentSerializer(serializers.Serializer):
    loan_id = serializers.IntegerField(help_text="Loan ID to repay")
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Repayment amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Repayment currency")
    notes = serializers.CharField(max_length=500, required=False, help_text="Repayment notes")

class LoanResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    loan_id = serializers.IntegerField()
    amount_entered = serializers.DecimalField(max_digits=10, decimal_places=2)
    amount_base = serializers.DecimalField(max_digits=10, decimal_places=2)