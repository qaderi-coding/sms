from rest_framework import viewsets
from .models import Purchase, PurchaseItem
from .serializers import PurchaseSerializer, PurchaseItemSerializer
from core.models import Transaction

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    
    def get_queryset(self):
        queryset = Purchase.objects.all()
        
        # Filter by transaction type
        transaction_type = self.request.query_params.get('type', None)
        if transaction_type == 'purchases':
            queryset = queryset.filter(transaction__type=Transaction.PURCHASE)
        elif transaction_type == 'returns':
            queryset = queryset.filter(transaction__type=Transaction.RETURN_PURCHASE)
        
        # Filter by supplier
        supplier = self.request.query_params.get('supplier', None)
        if supplier is not None:
            queryset = queryset.filter(supplier=supplier)
            
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')

class PurchaseItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseItem.objects.all()
    serializer_class = PurchaseItemSerializer