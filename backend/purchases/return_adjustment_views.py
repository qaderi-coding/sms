from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Purchase

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_purchase_return(request):
    """Adjust existing purchase return - creates adjustment transaction"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Get original return purchase (negative amounts)
            original_return = Purchase.objects.get(
                id=data['return_id'],
                transaction__type=Transaction.RETURN_PURCHASE
            )
            supplier = original_return.supplier
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
                # Return amount increased (more negative) - we get more refund from supplier
                impact = f'Return increased by {abs(adjustment_entered)} {currency} - we get more refund'
            else:
                # Return amount decreased (less negative) - we get less refund from supplier
                impact = f'Return decreased by {adjustment_entered} {currency} - we get less refund'
            
            # Create adjustment transaction
            adjustment_trans = Transaction.objects.create(
                type=Transaction.PURCHASE_ADJUSTMENT,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
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
                'message': 'Purchase return adjusted successfully',
                'adjustment_transaction_id': adjustment_trans.id,
                'adjustment_amount': adjustment_entered,
                'new_return_amount': new_return_entered,
                'impact': impact
            }, status=status.HTTP_200_OK)
            
    except Purchase.DoesNotExist:
        return Response({'error': 'Purchase return not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)