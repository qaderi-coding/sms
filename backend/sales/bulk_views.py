from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import BulkSaleCreateSerializer, BulkSaleReturnSerializer, SaleResponseSerializer
from django.db import transaction
from django.utils import timezone
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Sale, SaleItem
from parties.models import Customer
from inventory.models import Product

@swagger_auto_schema(
    method='post',
    request_body=BulkSaleCreateSerializer,
    responses={201: SaleResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_create_sale(request):
    """Create sale with multiple items at once"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            customer = Customer.objects.get(id=data['customer_id'])
            currency = data['currency']
            
            if not validate_currency(currency):
                return Response({'error': f'Invalid currency: {currency}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate item totals first
            items_total_entered = Decimal('0')
            items_total_base = Decimal('0')
            
            # Get exchange rate once for consistency
            amount_base, exchange_rate = convert_currency(Decimal('1'), currency, 'AFN')
            
            # Validate and calculate items
            validated_items = []
            for item_data in data['items']:
                product = Product.objects.get(id=item_data['product_id'])
                quantity = Decimal(str(item_data['quantity']))
                unit_price_entered = Decimal(str(item_data['unit_price_entered']))
                
                if quantity <= 0 or unit_price_entered < 0:
                    return Response({'error': 'Invalid quantity or price'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                item_total_entered = quantity * unit_price_entered
                item_total_base = item_total_entered * exchange_rate
                
                items_total_entered += item_total_entered
                items_total_base += item_total_base
                
                validated_items.append({
                    'product': product,
                    'quantity': quantity,
                    'unit_price_entered': unit_price_entered,
                    'unit_price_base': unit_price_entered * exchange_rate,
                    'item_total_entered': item_total_entered,
                    'item_total_base': item_total_base
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
            
            # Handle additional fields
            discount_amount = Decimal(str(data.get('discount_amount', 0)))
            tax_amount = Decimal(str(data.get('tax_amount', 0)))
            reference_number = data.get('reference_number', '')
            sale_date = data.get('sale_date')
            
            # Adjust total for discount and tax
            final_total_entered = total_entered - discount_amount + tax_amount
            final_total_base = final_total_entered * exchange_rate
            
            # Create transaction record
            trans_notes = data.get('notes', f'Sale to {customer.name}')
            if reference_number:
                trans_notes += f' (Ref: {reference_number})'
            
            trans = Transaction.objects.create(
                type=Transaction.SALE,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=final_total_entered,
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=final_total_base,
                notes=trans_notes,
                created_at=sale_date if sale_date else timezone.now()
            )
            
            # Create sale record
            sale = Sale.objects.create(
                transaction=trans,
                customer=customer,
                total_entered=final_total_entered,
                currency=currency,
                exchange_rate_to_base=exchange_rate,
                total_base=final_total_base,
                status=data.get('status', 'unpaid')
            )
            
            # Create sale items
            for item in validated_items:
                SaleItem.objects.create(
                    sale=sale,
                    product=item['product'],
                    quantity=item['quantity'],
                    unit_price_entered=item['unit_price_entered'],
                    currency=currency,
                    unit_price_base=item['unit_price_base']
                )
            
            return Response({
                'message': 'Sale created successfully',
                'sale_id': sale.id,
                'transaction_id': trans.id,
                'total_entered': final_total_entered,
                'total_base': final_total_base,
                'exchange_rate': exchange_rate,
                'currency': currency,
                'status': sale.status,
                'customer_name': customer.name,
                'items_count': len(validated_items),
                'created_at': sale.created_at
            }, status=status.HTTP_201_CREATED)
            
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='post',
    request_body=BulkSaleReturnSerializer,
    responses={201: SaleResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_return_sale(request):
    """Process sale return with multiple items"""
    data = request.data
    
    try:
        with transaction.atomic():
            # Validate inputs
            customer = Customer.objects.get(id=data['customer_id'])
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
                    'quantity': quantity,  # Keep positive for return items
                    'unit_price_entered': unit_price_entered,
                    'unit_price_base': unit_price_entered * exchange_rate
                })
            
            # Return amounts are negative in transaction
            total_entered = -items_total_entered
            total_base = total_entered * exchange_rate
            
            # Create return transaction
            trans = Transaction.objects.create(
                type=Transaction.RETURN_SALE,
                party_type=Transaction.CUSTOMER,
                party_id=customer.id,
                entered_amount=total_entered,  # Negative amount
                entered_currency=currency,
                exchange_rate_to_base=exchange_rate,
                amount_base=total_base,  # Negative amount
                notes=data.get('notes', f'Sale return from {customer.name}')
            )
            
            # Create return sale record
            sale = Sale.objects.create(
                transaction=trans,
                customer=customer,
                total_entered=total_entered,  # Negative amount
                currency=currency,
                exchange_rate_to_base=exchange_rate,
                total_base=total_base,  # Negative amount
                status='paid'  # Returns are processed immediately
            )
            
            # Create return items (negative quantities)
            for item in validated_items:
                SaleItem.objects.create(
                    sale=sale,
                    product=item['product'],
                    quantity=-item['quantity'],  # Negative for returns
                    unit_price_entered=item['unit_price_entered'],
                    currency=currency,
                    unit_price_base=item['unit_price_base']
                )
            
            return Response({
                'message': 'Sale return processed successfully',
                'return_id': sale.id,
                'transaction_id': trans.id,
                'total_returned': -total_entered,  # Show positive amount to user
                'total_base': -total_base,
                'exchange_rate': exchange_rate
            }, status=status.HTTP_201_CREATED)
            
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)