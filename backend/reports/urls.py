from django.urls import path
from . import views

urlpatterns = [
    path('profit-loss/', views.profit_loss_report, name='profit-loss'),
    path('dashboard/', views.dashboard_summary, name='dashboard-summary'),
    path('customer-aging/', views.customer_aging_report, name='customer-aging'),
    path('sales-summary/', views.sales_summary, name='sales-summary'),
]