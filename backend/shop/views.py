from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import *
from .serializers import *

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductItemViewSet(viewsets.ModelViewSet):
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

class ExchangeRateViewSet(viewsets.ModelViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    @action(detail=False, methods=['post'])
    def create_sale(self, request):
        with transaction.atomic():
            sale_data = request.data
            items_data = sale_data.pop('items', [])
            
            # Create transaction
            trans = Transaction.objects.create(
                type='sale',
                party_type='customer',
                party_id=sale_data['customer'],
                original_amount=sale_data['total_amount'],
                currency=sale_data['currency'],
                exchange_rate_to_usd=sale_data.get('exchange_rate_to_usd', 1),
                amount_usd=sale_data['total_amount'] * sale_data.get('exchange_rate_to_usd', 1)
            )
            
            # Create sale
            sale = Sale.objects.create(transaction=trans, **sale_data)
            
            # Create sale items
            for item_data in items_data:
                SaleItem.objects.create(sale=sale, **item_data)
                
                # Update stock
                product_item = ProductItem.objects.filter(
                    product=item_data['product']
                ).first()
                if product_item:
                    product_item.quantity -= item_data['quantity']
                    product_item.save()
                    
                    StockMovement.objects.create(
                        product_item=product_item,
                        transaction_type='sale',
                        quantity=-item_data['quantity']
                    )
            
            return Response(SaleSerializer(sale).data, status=status.HTTP_201_CREATED)

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    @action(detail=False, methods=['post'])
    def create_purchase(self, request):
        with transaction.atomic():
            purchase_data = request.data
            items_data = purchase_data.pop('items', [])
            
            # Create transaction
            trans = Transaction.objects.create(
                type='purchase',
                party_type='supplier',
                party_id=purchase_data['supplier'],
                original_amount=purchase_data['total_amount'],
                currency=purchase_data['currency'],
                exchange_rate_to_usd=purchase_data.get('exchange_rate_to_usd', 1),
                amount_usd=purchase_data['total_amount'] * purchase_data.get('exchange_rate_to_usd', 1)
            )
            
            # Create purchase
            purchase = Purchase.objects.create(transaction=trans, **purchase_data)
            
            # Create purchase items
            for item_data in items_data:
                PurchaseItem.objects.create(purchase=purchase, **item_data)
                
                # Update stock
                product_item, created = ProductItem.objects.get_or_create(
                    product=item_data['product'],
                    defaults={
                        'purchase_price': item_data['unit_price'],
                        'currency': item_data['currency'],
                        'exchange_rate_to_usd': purchase_data.get('exchange_rate_to_usd', 1),
                        'quantity': 0
                    }
                )
                
                product_item.quantity += item_data['quantity']
                product_item.save()
                
                StockMovement.objects.create(
                    product_item=product_item,
                    transaction_type='purchase',
                    quantity=item_data['quantity']
                )
            
            return Response(PurchaseSerializer(purchase).data, status=status.HTTP_201_CREATED)

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer