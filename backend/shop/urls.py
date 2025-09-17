from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'product-items', views.ProductItemViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'currencies', views.CurrencyViewSet)
router.register(r'exchange-rates', views.ExchangeRateViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'sales', views.SaleViewSet)
router.register(r'purchases', views.PurchaseViewSet)
router.register(r'expenses', views.ExpenseViewSet)
router.register(r'loans', views.LoanViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'stock-movements', views.StockMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]