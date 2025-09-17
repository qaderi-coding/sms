from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import ExpenseCreateSerializer, WithdrawalCreateSerializer, DepositCreateSerializer, ExpenseResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Expense

@swagger_auto_schema(
    method='post',
    request_body=ExpenseCreateSerializer,
    responses={201: ExpenseResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_expense(request):
    """Record business expense"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            category = data['category']
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if category not in dict(Expense.EXPENSE_CATEGORIES):
                return Response({'error': f'Invalid expense category: {category}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Expense amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.EXPENSE,
                party_type=Transaction.NONE,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', f'{category.title()} expense')
            )
            
            # Create expense record
            expense = Expense.objects.create(
                transaction=trans,
                category=category,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base
            )
            
            return Response({
                'message': 'Expense recorded successfully',
                'expense_id': expense.id,
                'transaction_id': trans.id,
                'category': category,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=WithdrawalCreateSerializer,
    responses={201: ExpenseResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_withdrawal(request):
    """Record owner withdrawal"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Withdrawal amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.WITHDRAWAL,
                party_type=Transaction.OWNER,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', 'Owner withdrawal')
            )
            
            return Response({
                'message': 'Withdrawal recorded successfully',
                'transaction_id': trans.id,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=DepositCreateSerializer,
    responses={201: ExpenseResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_deposit(request):
    """Record owner deposit"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Deposit amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.OWNER_DEPOSIT,
                party_type=Transaction.OWNER,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', 'Owner deposit')
            )
            
            return Response({
                'message': 'Deposit recorded successfully',
                'transaction_id': trans.id,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)