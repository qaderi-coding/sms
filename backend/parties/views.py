from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Customer, Supplier
from .serializers import CustomerSerializer, SupplierSerializer
from core.models import Transaction
from sales.models import Sale
from purchases.models import Purchase
from payments.models import Payment

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        customer = self.get_object()
        
        # Calculate total sales (what customer owes)
        total_sales = Sale.objects.filter(customer=customer).aggregate(
            total=Sum('total_base')
        )['total'] or 0
        
        # Calculate total payments received
        total_payments = Payment.objects.filter(
            party_type='customer',
            party_id=customer.id
        ).aggregate(total=Sum('amount_base'))['total'] or 0
        
        balance = total_sales - total_payments
        
        return Response({
            'customer_id': customer.id,
            'customer_name': customer.name,
            'current_balance': balance,
            'total_sales': total_sales,
            'total_payments': total_payments,
            'currency': 'AFN'
        })

    @action(detail=True, methods=['get'])
    def statement(self, request, pk=None):
        customer = self.get_object()
        
        # Get all transactions for this customer
        transactions = Transaction.objects.filter(
            Q(party_type='customer', party_id=customer.id)
        ).order_by('-created_at')
        
        statement = []
        running_balance = 0
        
        for trans in transactions:
            if trans.type == 'sale':
                running_balance += trans.amount_base
                amount = trans.amount_base
            elif trans.type == 'payment_received':
                running_balance -= trans.amount_base
                amount = -trans.amount_base
            else:
                amount = trans.amount_base if trans.type in ['loan_given'] else -trans.amount_base
                running_balance += amount
            
            statement.append({
                'date': trans.created_at.date(),
                'type': trans.get_type_display(),
                'amount': amount,
                'balance_after': running_balance,
                'description': trans.notes or f"{trans.get_type_display()} #{trans.id}"
            })
        
        return Response({
            'customer_id': customer.id,
            'customer_name': customer.name,
            'current_balance': running_balance,
            'transactions': statement
        })

    @action(detail=True, methods=['get'])
    def outstanding_invoices(self, request, pk=None):
        customer = self.get_object()
        
        unpaid_sales = Sale.objects.filter(
            customer=customer,
            status__in=['unpaid', 'partial']
        ).order_by('created_at')
        
        invoices = []
        total_outstanding = 0
        
        for sale in unpaid_sales:
            paid_amount = Payment.objects.filter(
                party_type='customer',
                party_id=customer.id,
                created_at__gte=sale.created_at
            ).aggregate(total=Sum('amount_base'))['total'] or 0
            
            outstanding = max(0, sale.total_base - paid_amount)
            total_outstanding += outstanding
            
            invoices.append({
                'sale_id': sale.id,
                'date': sale.created_at.date(),
                'total_amount': sale.total_base,
                'paid_amount': paid_amount,
                'outstanding': outstanding,
                'status': sale.status
            })
        
        return Response({
            'customer_id': customer.id,
            'customer_name': customer.name,
            'total_outstanding': total_outstanding,
            'currency': 'AFN',
            'invoices': invoices
        })

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        supplier = self.get_object()
        
        # Calculate total purchases (what we owe supplier)
        total_purchases = Purchase.objects.filter(supplier=supplier).aggregate(
            total=Sum('total_base')
        )['total'] or 0
        
        # Calculate total payments made
        total_payments = Payment.objects.filter(
            party_type='supplier',
            party_id=supplier.id
        ).aggregate(total=Sum('amount_base'))['total'] or 0
        
        balance = total_purchases - total_payments
        
        return Response({
            'supplier_id': supplier.id,
            'supplier_name': supplier.name,
            'current_balance': balance,
            'total_purchases': total_purchases,
            'total_payments': total_payments,
            'currency': 'AFN'
        })