from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Sale, SaleItem
from .serializers import SaleSerializer, SaleItemSerializer
from core.models import Transaction

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    
    def get_queryset(self):
        queryset = Sale.objects.all()
        
        # Filter by transaction type
        transaction_type = self.request.query_params.get('type', None)
        if transaction_type == 'sales':
            queryset = queryset.filter(transaction__type=Transaction.SALE)
        elif transaction_type == 'returns':
            queryset = queryset.filter(transaction__type=Transaction.RETURN_SALE)
        
        # Filter by is_return boolean
        is_return = self.request.query_params.get('is_return', None)
        if is_return is not None:
            if is_return.lower() == 'true':
                queryset = queryset.filter(transaction__type=Transaction.RETURN_SALE)
            else:
                queryset = queryset.filter(transaction__type=Transaction.SALE)
        
        # Filter by customer
        customer = self.request.query_params.get('customer', None)
        if customer is not None:
            queryset = queryset.filter(customer=customer)
            
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer