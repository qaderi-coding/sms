from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import ReturnAdjustmentSerializer, SaleResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Sale

@swagger_auto_schema(
    method='post',
    request_body=ReturnAdjustmentSerializer,
    responses={201: SaleResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_sale_return(request):
    """Adjust existing sale return - creates adjustment transaction"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Get original return sale (negative amounts)
            original_return = Sale.objects.get(
                id=data['return_id'],
                transaction__type=Transaction.RETURN_SALE
            )
            customer = original_return.customer
            currency = data.get('currency', original_return.currency)
            
            # Calculate new return totals (user enters positive amount)
            new_return_entered = Decimal(str(data['new_return_amount']))
            amount_base, exchange_rate = convert_currency(new_return_entered, currency, 'AFN')
            
            # Convert to negative for return (stored as negative)
            new_total_entered = -new_return_entered
            new_total_base = -amount_base
            
            # Calculate adjustment amount
            adjustment_entered = new_total_entered - original_return.total_entered
            adjustment_base = new_total_base - original_return.total_base
            
            if adjustment_entered == 0:
                return Response({'error': 'No adjustment needed'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Determine impact
            if adjustment_entered < 0:
                # Return amount increased (more negative) - customer gets more refund
                impact = f'Return increased by {abs(adjustment_entered)} {currency} - customer gets more refund'
            else:
                # Return amount decreased (less negative) - customer gets less refund
                impact = f'Return decreased by {adjustment_entered} {currency} - customer gets less refund'
            
            # Create adjustment transaction
            adjustment_trans = Transaction.objects.create(
                type=Transaction.SALE_ADJUSTMENT,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=adjustment_entered,  # Can be positive or negative
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=adjustment_base,
                notes=data.get('notes', f'Return adjustment for return #{original_return.id}')
            )
            
            # Update original return totals
            original_return.total_entered = new_total_entered
            original_return.total_base = new_total_base
            original_return.save()
            
            return Response({
                'message': 'Sale return adjusted successfully',
                'adjustment_transaction_id': adjustment_trans.id,
                'adjustment_amount': adjustment_entered,
                'new_return_amount': new_return_entered,
                'impact': impact
            }, status=status.HTTP_200_OK)
            
    except Sale.DoesNotExist:
        return Response({'error': 'Sale return not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)