from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .serializers import CreateOrUpdateSaleSerializer, CreateOrUpdateResponseSerializer
from django.db import transaction
from decimal import Decimal

from core.models import Transaction
from core.utils import convert_currency, validate_currency
from .models import Sale, SaleItem
from parties.models import Customer
from inventory.models import Product

@swagger_auto_schema(
    method='post',
    request_body=CreateOrUpdateSaleSerializer,
    responses={200: CreateOrUpdateResponseSerializer, 201: CreateOrUpdateResponseSerializer, 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_or_update_sale(request):
    """Create new sale OR update existing sale with adjustment"""
    data = request.data
    
    try:
        with transaction.atomic():
            sale_id = data.get('sale_id')  # If provided, it's an update
            
            if sale_id:
                # UPDATE EXISTING SALE (creates adjustment)
                return _update_existing_sale(data, sale_id)
            else:
                # CREATE NEW SALE
                return _create_new_sale(data)
                
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def _create_new_sale(data):
    """Create new sale"""
    customer = Customer.objects.get(id=data['customer_id'])
    currency = data['currency']
    
    # Calculate totals
    total_entered = Decimal(str(data['total_entered']))
    amount_base, exchange_rate = convert_currency(total_entered, currency, 'AFN')
    
    # Create transaction
    trans = Transaction.objects.create(
        type=Transaction.SALE,
        party_type=Transaction.CUSTOMER,
        party_id=customer.id,
        entered_amount=total_entered,
        entered_currency=currency,
        exchange_rate_to_base=exchange_rate,
        amount_base=amount_base,
        notes=data.get('notes', f'Sale to {customer.name}')
    )
    
    # Create sale
    sale = Sale.objects.create(
        transaction=trans,
        customer=customer,
        total_entered=total_entered,
        currency=currency,
        exchange_rate_to_base=exchange_rate,
        total_base=amount_base,
        status=data.get('status', 'unpaid')
    )
    
    # Create items
    for item_data in data['items']:
        product = Product.objects.get(id=item_data['product_id'])
        quantity = Decimal(str(item_data['quantity']))
        unit_price_entered = Decimal(str(item_data['unit_price_entered']))
        
        SaleItem.objects.create(
            sale=sale,
            product=product,
            quantity=quantity,
            unit_price_entered=unit_price_entered,
            currency=currency,
            unit_price_base=unit_price_entered * exchange_rate
        )
    
    return Response({
        'action': 'created',
        'sale_id': sale.id,
        'transaction_id': trans.id,
        'total': total_entered
    }, status=status.HTTP_201_CREATED)

def _update_existing_sale(data, sale_id):
    """Update existing sale with adjustment"""
    original_sale = Sale.objects.get(id=sale_id)
    customer = original_sale.customer
    currency = data.get('currency', original_sale.currency)
    
    # Calculate new totals
    new_total_entered = Decimal(str(data['total_entered']))
    amount_base, exchange_rate = convert_currency(new_total_entered, currency, 'AFN')
    
    # Calculate adjustment
    adjustment_entered = new_total_entered - original_sale.total_entered
    adjustment_base = amount_base - original_sale.total_base
    
    if adjustment_entered == 0:
        return Response({
            'action': 'no_change',
            'message': 'No adjustment needed'
        }, status=status.HTTP_200_OK)
    
    # Create adjustment transaction
    adjustment_trans = Transaction.objects.create(
        type=Transaction.SALE_ADJUSTMENT,
        party_type=Transaction.CUSTOMER,
        party_id=customer.id,
        entered_amount=adjustment_entered,
        entered_currency=currency,
        exchange_rate_to_base=exchange_rate,
        amount_base=adjustment_base,
        notes=data.get('notes', f'Sale adjustment for sale #{sale_id}')
    )
    
    # Update original sale
    original_sale.total_entered = new_total_entered
    original_sale.total_base = amount_base
    original_sale.save()
    
    # Update items if provided
    if 'items' in data:
        original_sale.items.all().delete()
        for item_data in data['items']:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = Decimal(str(item_data['quantity']))
            unit_price_entered = Decimal(str(item_data['unit_price_entered']))
            
            SaleItem.objects.create(
                sale=original_sale,
                product=product,
                quantity=quantity,
                unit_price_entered=unit_price_entered,
                currency=currency,
                unit_price_base=unit_price_entered * exchange_rate
            )
    
    return Response({
        'action': 'adjusted',
        'sale_id': original_sale.id,
        'adjustment_transaction_id': adjustment_trans.id,
        'adjustment_amount': adjustment_entered,
        'new_total': new_total_entered
    }, status=status.HTTP_200_OK)