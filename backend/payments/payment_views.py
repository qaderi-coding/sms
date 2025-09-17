from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import PaymentCreateSerializer, PaymentResponseSerializer
from django.db import transaction
from django.db.models import Sum
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Payment
from sales.models import Sale
from purchases.models import Purchase
from parties.models import Customer, Supplier

@swagger_auto_schema(
    method='post',
    request_body=PaymentCreateSerializer,
    responses={201: PaymentResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def receive_payment(request):
    """Receive payment from customer (general payment)"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            customer = Customer.objects.get(id=data['customer_id'])
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Payment amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.PAYMENT_RECEIVED,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', f'Payment received from {customer.name}')
            )
            
            # Create payment record
            payment = Payment.objects.create(
                transaction=trans,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                method=data['method']
            )
            
            # Auto-update oldest unpaid sales (FIFO) - Fixed logic
            unpaid_sales = Sale.objects.filter(
                customer=customer,
                status__in=['unpaid', 'partial']
            ).order_by('created_at')
            
            # Calculate current customer balance
            total_sales = Sale.objects.filter(customer=customer).aggregate(
                total=Sum('total_base')
            )['total'] or Decimal('0')
            
            total_payments = Payment.objects.filter(
                party_type='customer',
                party_id=customer.id
            ).aggregate(total=Sum('amount_base'))['total'] or Decimal('0')
            
            current_balance = total_sales - total_payments
            
            # Update sale statuses based on new balance
            remaining_credit = max(Decimal('0'), -current_balance)  # Customer credit
            
            for sale in unpaid_sales:
                if remaining_credit >= sale.total_base:
                    sale.status = 'paid'
                    remaining_credit -= sale.total_base
                elif remaining_credit > 0:
                    sale.status = 'partial'
                    remaining_credit = Decimal('0')
                else:
                    sale.status = 'unpaid'
                
                sale.save()
            
            return Response({
                'message': 'Payment received successfully',
                'payment_id': payment.id,
                'transaction_id': trans.id,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate,
                'customer_balance': current_balance
            }, status=status.HTTP_201_CREATED)
            
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=PaymentCreateSerializer,
    responses={201: PaymentResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request):
    """Make payment to supplier (general payment)"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            supplier = Supplier.objects.get(id=data['supplier_id'])
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate amounts with latest exchange rate
            entered_amount = Decimal(str(data['amount']))
            if entered_amount <= 0:
                return Response({'error': 'Payment amount must be positive'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            amount_base, exchange_rate = convert_currency(entered_amount, currency, 'AFN')
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.PAYMENT_MADE,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                notes=data.get('notes', f'Payment made to {supplier.name}')
            )
            
            # Create payment record
            payment = Payment.objects.create(
                transaction=trans,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
                entered_amount=entered_amount,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=amount_base,
                method=data['method']
            )
            
            # Auto-update oldest unpaid purchases (FIFO)
            unpaid_purchases = Purchase.objects.filter(
                supplier=supplier,
                status__in=['unpaid', 'partial']
            ).order_by('created_at')
            
            # Calculate current supplier balance
            total_purchases = Purchase.objects.filter(supplier=supplier).aggregate(
                total=Sum('total_base')
            )['total'] or Decimal('0')
            
            total_payments = Payment.objects.filter(
                party_type='supplier',
                party_id=supplier.id
            ).aggregate(total=Sum('amount_base'))['total'] or Decimal('0')
            
            current_balance = total_purchases - total_payments
            
            # Update purchase statuses based on new balance
            remaining_credit = max(Decimal('0'), -current_balance)  # Supplier credit
            
            for purchase in unpaid_purchases:
                if remaining_credit >= purchase.total_base:
                    purchase.status = 'paid'
                    remaining_credit -= purchase.total_base
                elif remaining_credit > 0:
                    purchase.status = 'partial'
                    remaining_credit = Decimal('0')
                else:
                    purchase.status = 'unpaid'
                
                purchase.save()
            
            return Response({
                'message': 'Payment made successfully',
                'payment_id': payment.id,
                'transaction_id': trans.id,
                'amount_entered': entered_amount,
                'amount_base': amount_base,
                'exchange_rate': exchange_rate,
                'supplier_balance': current_balance
            }, status=status.HTTP_201_CREATED)
            
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)