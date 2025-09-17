from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .api_docs import api_documentation

router = DefaultRouter()
router.register(r'currencies', views.CurrencyViewSet)
router.register(r'exchange-rates', views.ExchangeRateViewSet)
router.register(r'transactions', views.TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('docs/', api_documentation, name='api-docs'),
]