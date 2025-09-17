from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .bulk_views import bulk_create_purchase, bulk_return_purchase
from .adjustment_views import adjust_purchase
from .return_adjustment_views import adjust_purchase_return
from .endpoint_info import purchase_endpoints

router = DefaultRouter()
router.register(r'purchases', views.PurchaseViewSet)
router.register(r'purchase-items', views.PurchaseItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bulk-create/', bulk_create_purchase, name='bulk-create-purchase'),
    path('bulk-return/', bulk_return_purchase, name='bulk-return-purchase'),
    path('adjust/', adjust_purchase, name='adjust-purchase'),
    path('adjust-return/', adjust_purchase_return, name='adjust-purchase-return'),
    path('endpoints/', purchase_endpoints, name='purchase-endpoints'),
]