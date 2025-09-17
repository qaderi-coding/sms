from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Purchase, PurchaseItem
from inventory.models import Product

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_purchase(request):
    """Adjust existing purchase - creates adjustment transaction"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Get original purchase
            original_purchase = Purchase.objects.get(id=data['purchase_id'])
            supplier = original_purchase.supplier
            currency = data.get('currency', original_purchase.currency)
            
            # Calculate new totals
            new_total_entered = Decimal(str(data['new_total_entered']))
            amount_base, exchange_rate = convert_currency(new_total_entered, currency, 'AFN')
            
            # Calculate adjustment amount
            adjustment_entered = new_total_entered - original_purchase.total_entered
            adjustment_base = amount_base - original_purchase.total_base
            
            if adjustment_entered == 0:
                return Response({'error': 'No adjustment needed'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Create adjustment transaction
            adjustment_trans = Transaction.objects.create(
                type=Transaction.PURCHASE_ADJUSTMENT,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
                entered_amount=adjustment_entered,  # Can be positive or negative
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=adjustment_base,  # Can be positive or negative
                notes=data.get('notes', f'Purchase adjustment for purchase #{original_purchase.id}')
            )
            
            # Update original purchase totals
            original_purchase.total_entered = new_total_entered
            original_purchase.total_base = amount_base
            original_purchase.save()
            
            return Response({
                'message': 'Purchase adjusted successfully',
                'adjustment_transaction_id': adjustment_trans.id,
                'adjustment_amount': adjustment_entered,
                'new_total': new_total_entered
            }, status=status.HTTP_200_OK)
            
    except Purchase.DoesNotExist:
        return Response({'error': 'Purchase not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)