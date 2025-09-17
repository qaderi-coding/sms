from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import SaleAdjustmentSerializer, SaleResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Sale, SaleItem
from inventory.models import Product

@swagger_auto_schema(
    method='post',
    request_body=SaleAdjustmentSerializer,
    responses={201: SaleResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_sale(request):
    """Adjust existing sale - creates adjustment transaction"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Get original sale
            original_sale = Sale.objects.get(id=data['sale_id'])
            customer = original_sale.customer
            currency = data.get('currency', original_sale.currency)
            
            # Calculate new totals
            new_total_entered = Decimal(str(data['new_total_entered']))
            amount_base, exchange_rate = convert_currency(new_total_entered, currency, 'AFN')
            
            # Calculate adjustment amount
            adjustment_entered = new_total_entered - original_sale.total_entered
            adjustment_base = amount_base - original_sale.total_base
            
            if adjustment_entered == 0:
                return Response({'error': 'No adjustment needed'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Create adjustment transaction
            adjustment_trans = Transaction.objects.create(
                type=Transaction.SALE_ADJUSTMENT,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=adjustment_entered,  # Can be positive or negative
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=adjustment_base,  # Can be positive or negative
                notes=data.get('notes', f'Sale adjustment for sale #{original_sale.id}')
            )
            
            # Update original sale totals
            original_sale.total_entered = new_total_entered
            original_sale.total_base = amount_base
            original_sale.save()
            
            return Response({
                'message': 'Sale adjusted successfully',
                'adjustment_transaction_id': adjustment_trans.id,
                'adjustment_amount': adjustment_entered,
                'new_total': new_total_entered
            }, status=status.HTTP_200_OK)
            
    except Sale.DoesNotExist:
        return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)