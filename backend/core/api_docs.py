from django.http import JsonResponse
from django.urls import reverse
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

@permission_classes([AllowAny])
def api_documentation(request):
    """Return all API endpoints in JSON format"""
    
    api_routes = {
        "Authentication APIs": {
            "login": "/api/auth/login/",
            "refresh_token": "/api/auth/refresh/",
            "user_profile": "/api/auth/user/"
        },
        "Core APIs": {
            "currencies": "/api/core/currencies/",
            "exchange_rates": "/api/core/exchange-rates/",
            "transactions": "/api/core/transactions/"
        },
        "Inventory APIs": {
            "categories": "/api/inventory/categories/",
            "products": "/api/inventory/products/",
            "product_items": "/api/inventory/product-items/",
            "stock_movements": "/api/inventory/stock-movements/"
        },
        "Parties APIs": {
            "customers": "/api/parties/customers/",
            "suppliers": "/api/parties/suppliers/"
        },
        "Sales APIs": {
            "sales": "/api/sales/sales/"
        },
        "Purchase APIs": {
            "purchases": "/api/purchases/purchases/"
        },
        "Expense APIs": {
            "expenses": "/api/expenses/expenses/"
        },
        "Loan APIs": {
            "loans": "/api/loans/loans/"
        },
        "Payment APIs": {
            "payments": "/api/payments/payments/"
        },
        "Report APIs": {
            "profit_loss": "/api/reports/profit-loss/",
            "dashboard_summary": "/api/reports/dashboard/",
            "customer_aging": "/api/reports/customer-aging/",
            "sales_summary": "/api/reports/sales-summary/"
        },
        "Balance APIs": {
            "customer_balance": "/api/parties/customers/{id}/balance/",
            "customer_statement": "/api/parties/customers/{id}/statement/",
            "customer_outstanding": "/api/parties/customers/{id}/outstanding_invoices/",
            "supplier_balance": "/api/parties/suppliers/{id}/balance/"
        },
        "Bulk Transaction APIs": {
            "bulk_create_sale": "/api/sales/bulk-create/",
            "bulk_return_sale": "/api/sales/bulk-return/",
            "bulk_create_purchase": "/api/purchases/bulk-create/",
            "bulk_return_purchase": "/api/purchases/bulk-return/",
            "receive_payment": "/api/payments/receive/",
            "make_payment": "/api/payments/make/"
        },
        "Adjustment APIs": {
            "adjust_sale": "/api/sales/adjust/",
            "adjust_purchase": "/api/purchases/adjust/",
            "adjust_sale_return": "/api/sales/adjust-return/",
            "adjust_purchase_return": "/api/purchases/adjust-return/"
        }
    }
    
    return JsonResponse({
        "message": "Shop Management System API Documentation",
        "base_url": request.build_absolute_uri('/'),
        "endpoints": api_routes,
        "authentication": {
            "type": "JWT Bearer Token",
            "header": "Authorization: Bearer <access_token>",
            "login_endpoint": "/api/auth/login/",
            "login_payload": {"username": "your_username", "password": "your_password"},
            "login_response": {
                "access": "jwt_access_token",
                "refresh": "jwt_refresh_token",
                "user": {
                    "id": 1,
                    "username": "username",
                    "email": "email@example.com",
                    "first_name": "First",
                    "last_name": "Last",
                    "is_staff": True,
                    "is_superuser": False,
                    "groups": ["group_name"],
                    "permissions": ["permission_codename"]
                }
            }
        },
        "note": "All ViewSet endpoints support GET, POST, PUT, PATCH, DELETE methods"
    }, indent=2)