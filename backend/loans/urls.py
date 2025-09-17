from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .loan_views import give_loan, repay_loan

router = DefaultRouter()
router.register(r'loans', views.LoanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('give/', give_loan, name='give-loan'),
    path('repay/', repay_loan, name='repay-loan'),
]