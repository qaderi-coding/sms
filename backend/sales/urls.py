from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .bulk_views import bulk_create_sale, bulk_return_sale
from .adjustment_views import adjust_sale
from .return_adjustment_views import adjust_sale_return
from .enhanced_views import create_or_update_sale
from .endpoint_info import sales_endpoints
router = DefaultRouter()
router.register(r'sales', views.SaleViewSet)
router.register(r'sale-items', views.SaleItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bulk-create/', bulk_create_sale, name='bulk-create-sale'),
    path('bulk-return/', bulk_return_sale, name='bulk-return-sale'),
    path('adjust/', adjust_sale, name='adjust-sale'),
    path('adjust-return/', adjust_sale_return, name='adjust-sale-return'),
    path('create-or-update/', create_or_update_sale, name='create-or-update-sale'),
    path('endpoints/', sales_endpoints, name='sales-endpoints'),
]