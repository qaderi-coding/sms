from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal

from core.models import Transaction
from sales.models import Sale
from purchases.models import Purchase
from payments.models import Payment
from expenses.models import Expense
from parties.models import Customer, Supplier

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profit_loss_report(request):
    """Generate profit and loss report"""
    start_date = request.GET.get('start_date', date.today().replace(day=1))
    end_date = request.GET.get('end_date', date.today())
    
    # Sales revenue
    sales_revenue = Sale.objects.filter(
        created_at__date__range=[start_date, end_date]
    ).aggregate(total=Sum('total_base'))['total'] or 0
    
    # Purchase costs
    purchase_costs = Purchase.objects.filter(
        created_at__date__range=[start_date, end_date]
    ).aggregate(total=Sum('total_base'))['total'] or 0
    
    # Expenses
    expenses = Expense.objects.filter(
        created_at__date__range=[start_date, end_date]
    ).aggregate(total=Sum('amount_base'))['total'] or 0
    
    # Withdrawals
    withdrawals = Transaction.objects.filter(
        type=Transaction.WITHDRAWAL,
        created_at__date__range=[start_date, end_date]
    ).aggregate(total=Sum('amount_base'))['total'] or 0
    
    gross_profit = sales_revenue - purchase_costs
    net_profit = gross_profit - expenses - withdrawals
    
    return Response({
        'period': {'start': start_date, 'end': end_date},
        'sales_revenue': sales_revenue,
        'purchase_costs': purchase_costs,
        'gross_profit': gross_profit,
        'expenses': expenses,
        'withdrawals': withdrawals,
        'net_profit': net_profit,
        'currency': 'AFN'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary data"""
    today = date.today()
    
    # Today's sales
    today_sales = Sale.objects.filter(
        created_at__date=today
    ).aggregate(total=Sum('total_base'))['total'] or 0
    
    # Today's payments received
    today_payments = Payment.objects.filter(
        party_type='customer',
        created_at__date=today
    ).aggregate(total=Sum('amount_base'))['total'] or 0
    
    # Outstanding customer balances
    customer_outstanding = 0
    for customer in Customer.objects.all():
        sales_total = Sale.objects.filter(customer=customer).aggregate(
            total=Sum('total_base')
        )['total'] or 0
        payments_total = Payment.objects.filter(
            party_type='customer',
            party_id=customer.id
        ).aggregate(total=Sum('amount_base'))['total'] or 0
        balance = sales_total - payments_total
        if balance > 0:
            customer_outstanding += balance
    
    # Outstanding supplier balances
    supplier_outstanding = 0
    for supplier in Supplier.objects.all():
        purchases_total = Purchase.objects.filter(supplier=supplier).aggregate(
            total=Sum('total_base')
        )['total'] or 0
        payments_total = Payment.objects.filter(
            party_type='supplier',
            party_id=supplier.id
        ).aggregate(total=Sum('amount_base'))['total'] or 0
        balance = purchases_total - payments_total
        if balance > 0:
            supplier_outstanding += balance
    
    # Recent transactions
    recent_transactions = Transaction.objects.all()[:10]
    
    return Response({
        'today_sales': today_sales,
        'today_payments': today_payments,
        'customer_outstanding': customer_outstanding,
        'supplier_outstanding': supplier_outstanding,
        'recent_transactions': [
            {
                'id': t.id,
                'type': t.get_type_display(),
                'amount': t.amount_base,
                'date': t.created_at.date(),
                'party': t.get_party_type_display() if t.party_type != 'none' else None
            } for t in recent_transactions
        ],
        'currency': 'AFN'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_aging_report(request):
    """Generate customer aging report"""
    customers_aging = []
    
    for customer in Customer.objects.all():
        # Calculate total balance
        sales_total = Sale.objects.filter(customer=customer).aggregate(
            total=Sum('total_base')
        )['total'] or 0
        payments_total = Payment.objects.filter(
            party_type='customer',
            party_id=customer.id
        ).aggregate(total=Sum('amount_base'))['total'] or 0
        
        balance = sales_total - payments_total
        
        if balance > 0:
            # Get oldest unpaid sale date
            oldest_sale = Sale.objects.filter(
                customer=customer,
                status__in=['unpaid', 'partial']
            ).order_by('created_at').first()
            
            days_outstanding = 0
            if oldest_sale:
                days_outstanding = (date.today() - oldest_sale.created_at.date()).days
            
            customers_aging.append({
                'customer_id': customer.id,
                'customer_name': customer.name,
                'balance': balance,
                'days_outstanding': days_outstanding,
                'aging_category': (
                    'Current' if days_outstanding <= 30 else
                    '31-60 Days' if days_outstanding <= 60 else
                    '61-90 Days' if days_outstanding <= 90 else
                    'Over 90 Days'
                )
            })
    
    return Response({
        'customers': customers_aging,
        'total_outstanding': sum(c['balance'] for c in customers_aging),
        'currency': 'AFN'
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_summary(request):
    """Get sales summary report"""
    start_date = request.GET.get('start_date', date.today().replace(day=1))
    end_date = request.GET.get('end_date', date.today())
    
    # Sales by period
    sales_data = Sale.objects.filter(
        created_at__date__range=[start_date, end_date]
    ).aggregate(
        total_sales=Sum('total_base'),
        total_count=Count('id')
    )
    
    # Top customers
    top_customers = []
    for customer in Customer.objects.all():
        customer_sales = Sale.objects.filter(
            customer=customer,
            created_at__date__range=[start_date, end_date]
        ).aggregate(total=Sum('total_base'))['total'] or 0
        
        if customer_sales > 0:
            top_customers.append({
                'customer_name': customer.name,
                'total_sales': customer_sales
            })
    
    top_customers.sort(key=lambda x: x['total_sales'], reverse=True)
    
    return Response({
        'period': {'start': start_date, 'end': end_date},
        'total_sales': sales_data['total_sales'] or 0,
        'total_transactions': sales_data['total_count'] or 0,
        'top_customers': top_customers[:10],
        'currency': 'AFN'
    })