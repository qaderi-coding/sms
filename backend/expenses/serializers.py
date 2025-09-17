from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

# Expense operation serializers
class ExpenseCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(
        choices=['transport', 'commission', 'rent', 'salary', 'misc'], 
        help_text="Expense category"
    )
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Expense amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Expense currency")
    notes = serializers.CharField(max_length=500, required=False, help_text="Expense description")

class WithdrawalCreateSerializer(serializers.Serializer):
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Withdrawal amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Withdrawal currency")
    notes = serializers.CharField(max_length=500, required=False, help_text="Withdrawal purpose")

class DepositCreateSerializer(serializers.Serializer):
    entered_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Deposit amount")
    entered_currency = serializers.ChoiceField(choices=['AFN', 'USD', 'PKR', 'CNY'], help_text="Deposit currency")
    notes = serializers.CharField(max_length=500, required=False, help_text="Deposit source")

class ExpenseResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    expense_id = serializers.IntegerField()
    amount_entered = serializers.DecimalField(max_digits=10, decimal_places=2)
    amount_base = serializers.DecimalField(max_digits=10, decimal_places=2)