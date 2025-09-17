from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import LoanCreateSerializer, LoanRepaymentSerializer, LoanResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Loan
from parties.models import Customer, Supplier

@swagger_auto_schema(
    method='post',
    request_body=LoanCreateSerializer,
    responses={201: LoanResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def give_loan(request):
    """Give loan to customer or supplier"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            party_type = data['party_type']
            party_id = data['party_id']
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Validate party exists
            if party_type == 'customer':
                party = Customer.objects.get(id=party_id)
                party_name = party.name
            elif party_type == 'supplier':
                party = Supplier.objects.get(id=party_id)
                party_name = party.name
            else:
                return Response({'error': 'Invalid party type'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Loan amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.LOAN_GIVEN,
                party_type=party_type,
                party_id=party_id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', f'Loan given to {party_name}')
            )
            
            # Create loan record
            loan = Loan.objects.create(
                transaction=trans,
                party_type=party_type,
                party_id=party_id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                status='active'
            )
            
            return Response({
                'message': 'Loan given successfully',
                'loan_id': loan.id,
                'transaction_id': trans.id,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except (Customer.DoesNotExist, Supplier.DoesNotExist):
        return Response({'error': 'Party not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=LoanRepaymentSerializer,
    responses={201: LoanResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def repay_loan(request):
    """Record loan repayment"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Get original loan
            loan = Loan.objects.get(id=data['loan_id'])
            
            if loan.status == 'closed':
                return Response({'error': 'Loan is already closed'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            currency = data['currency']
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Repayment amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Determine transaction type based on original loan
            if loan.transaction.type == Transaction.LOAN_GIVEN:
                trans_type = Transaction.LOAN_REPAYMENT_RECEIVED
                notes = f'Loan repayment received for loan #{loan.id}'
            else:
                trans_type = Transaction.LOAN_REPAYMENT_MADE
                notes = f'Loan repayment made for loan #{loan.id}'
            
            # Create repayment transaction
            trans = Transaction.objects.create(
                type=trans_type,
                party_type=loan.party_type,
                party_id=loan.party_id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', notes)
            )
            
            # Check if loan is fully repaid
            if amount_base >= loan.amount_base:
                loan.status = 'closed'
                loan.save()
            
            return Response({
                'message': 'Loan repayment recorded successfully',
                'transaction_id': trans.id,
                'loan_status': loan.status,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)