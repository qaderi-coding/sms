from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import BulkPurchaseCreateSerializer, BulkPurchaseReturnSerializer, PurchaseResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Purchase, PurchaseItem
from parties.models import Supplier
from inventory.models import Product

@swagger_auto_schema(
    method='post',
    request_body=BulkPurchaseCreateSerializer,
    responses={201: PurchaseResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_create_purchase(request):
    """Create purchase with multiple items at once"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            supplier = Supplier.objects.get(id=data['supplier_id'])
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Get exchange rate once for consistency
            amount_base, exchange_rate = convert_currency(Decimal('1'), currency, 'AFN')
            
            # Calculate and validate items
            items_total_entered = Decimal('0')
            validated_items = []
            
            for item_data in data['items']:
                product = Product.objects.get(id=item_data['product_id'])
                quantity = Decimal(str(item_data['quantity']))
                unit_price_entered = Decimal(str(item_data['unit_price_entered']))
                
                if quantity <= 0 or unit_price_entered < 0:
                    return Response({'error': 'Invalid quantity or price'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                item_total_entered = quantity * unit_price_entered
                items_total_entered += item_total_entered
                
                validated_items.append({
                    'product': product,
                    'quantity': quantity,
                    'unit_price_entered': unit_price_entered,
                    'unit_price_base': unit_price_entered * exchange_rate
                })
            
            # Use calculated totals or provided totals (with validation)
            total_entered = data.get('total_entered')
            if total_entered:
                total_entered = Decimal(str(total_entered))
                # Validate provided total matches calculated total
                if abs(total_entered - items_total_entered) > Decimal('0.01'):
                    return Response({'error': 'Total amount mismatch with items'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            else:
                total_entered = items_total_entered
            
            total_base = total_entered * exchange_rate
            
            # Create transaction record
            trans = Transaction.objects.create(
                type=Transaction.PURCHASE,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
                entered_amount=total_entered,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=total_base,
                notes=data.get('notes', f'Purchase from {supplier.name}')
            )
            
            # Create purchase record
            purchase = Purchase.objects.create(
                transaction=trans,
                supplier=supplier,
                total_entered=total_entered,
                currency=currency,
                exchange_rate_to_base=exchange_rate,
                total_base=total_base,
                status=data.get('status', 'unpaid')
            )
            
            # Create purchase items
            for item in validated_items:
                PurchaseItem.objects.create(
                    purchase=purchase,
                    product=item['product'],
                    quantity=item['quantity'],
                    unit_price_entered=item['unit_price_entered'],
                    currency=currency,
                    unit_price_base=item['unit_price_base']
                )
            
            return Response({
                'message': 'Purchase created successfully',
                'purchase_id': purchase.id,
                'transaction_id': trans.id,
                'total_entered': total_entered,
                'total_base': total_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=BulkPurchaseReturnSerializer,
    responses={201: PurchaseResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_return_purchase(request):
    """Process purchase return with multiple items"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            supplier = Supplier.objects.get(id=data['supplier_id'])
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Get exchange rate for consistency
            amount_base, exchange_rate = convert_currency(Decimal('1'), currency, 'AFN')
            
            # Calculate return totals
            items_total_entered = Decimal('0')
            validated_items = []
            
            for item_data in data['items']:
                product = Product.objects.get(id=item_data['product_id'])
                quantity = Decimal(str(item_data['quantity']))
                unit_price_entered = Decimal(str(item_data['unit_price_entered']))
                
                if quantity <= 0 or unit_price_entered < 0:
                    return Response({'error': 'Invalid return quantity or price'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                item_total_entered = quantity * unit_price_entered
                items_total_entered += item_total_entered
                
                validated_items.append({
                    'product': product,
                    'quantity': quantity,
                    'unit_price_entered': unit_price_entered,
                    'unit_price_base': unit_price_entered * exchange_rate
                })
            
            # Return amounts are negative in transaction
            total_entered = -items_total_entered
            total_base = total_entered * exchange_rate
            
            # Create return transaction
            trans = Transaction.objects.create(
                type=Transaction.RETURN_PURCHASE,
                party_type=Transaction.SUPPLIER,
                party_id=supplier.id,
                entered_amount=total_entered,  # Negative amount
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=total_base,  # Negative amount
                notes=data.get('notes', f'Purchase return to {supplier.name}')
            )
            
            # Create return purchase record
            purchase = Purchase.objects.create(
                transaction=trans,
                supplier=supplier,
                total_entered=total_entered,  # Negative amount
                currency=currency,
                exchange_rate_to_base=exchange_rate,
                total_base=total_base,  # Negative amount
                status='paid'  # Returns are processed immediately
            )
            
            # Create return items (negative quantities)
            for item in validated_items:
                PurchaseItem.objects.create(
                    purchase=purchase,
                    product=item['product'],
                    quantity=-item['quantity'],  # Negative for returns
                    unit_price_entered=item['unit_price_entered'],
                    currency=currency,
                    unit_price_base=item['unit_price_base']
                )
            
            return Response({
                'message': 'Purchase return processed successfully',
                'return_id': purchase.id,
                'transaction_id': trans.id,
                'total_returned': -total_entered,  # Show positive amount to user
                'total_base': -total_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)