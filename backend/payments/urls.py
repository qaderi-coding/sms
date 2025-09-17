from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .payment_views import receive_payment, make_payment

router = DefaultRouter()
router.register(r'payments', views.PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('receive/', receive_payment, name='receive-payment'),
    path('make/', make_payment, name='make-payment'),
]