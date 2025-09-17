from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .expense_views import create_expense, create_withdrawal, create_deposit

router = DefaultRouter()
router.register(r'expenses', views.ExpenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create/', create_expense, name='create-expense'),
    path('withdrawal/', create_withdrawal, name='create-withdrawal'),
    path('deposit/', create_deposit, name='create-deposit'),
]