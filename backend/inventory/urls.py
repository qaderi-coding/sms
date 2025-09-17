from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'units', views.UnitViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'bike-models', views.BikeModelViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'product-unit-conversions', views.ProductUnitConversionViewSet)
router.register(r'product-items', views.ProductItemViewSet)
router.register(r'stock-movements', views.StockMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]