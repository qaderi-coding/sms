from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    method='get',
    operation_description="Get sales API endpoint documentation",
    responses={200: 'Endpoint documentation'}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def sales_endpoints(request):
    """Show available sales endpoints with request body examples"""
    return Response({
        "message": "Sales API - Actual Request Body Structure",
        "endpoints": {
            "POST /api/sales/bulk-create/": {
                "required_fields": {
                    "customer_id": "integer - Customer ID",
                    "currency": "string - AFN, USD, PKR, CNY",
                    "items": "array - List of sale items"
                },
                "optional_fields": {
                    "total_entered": "decimal - Total amount (auto-calculated if not provided)",
                    "status": "string - unpaid (default), partial, paid",
                    "notes": "string - Additional notes"
                },
                "items_structure": {
                    "product_id": "integer - Product ID",
                    "quantity": "decimal - Item quantity (positive)",
                    "unit_price_entered": "decimal - Price per unit"
                },
                "example": {
                    "customer_id": 1,
                    "currency": "AFN",
                    "items": [
                        {
                            "product_id": 1,
                            "quantity": 2,
                            "unit_price_entered": 250.00
                        }
                    ],
                    "notes": "Optional sale notes"
                }
            },
            "POST /api/sales/bulk-return/": {
                "required_fields": {
                    "customer_id": "integer - Customer ID",
                    "currency": "string - AFN, USD, PKR, CNY",
                    "items": "array - List of return items"
                },
                "optional_fields": {
                    "notes": "string - Return reason/notes"
                },
                "items_structure": {
                    "product_id": "integer - Product ID",
                    "quantity": "decimal - Return quantity (positive, will be stored as negative)",
                    "unit_price_entered": "decimal - Price per unit"
                },
                "example": {
                    "customer_id": 1,
                    "currency": "AFN",
                    "items": [
                        {
                            "product_id": 1,
                            "quantity": 1,
                            "unit_price_entered": 250.00
                        }
                    ],
                    "notes": "Defective item"
                }
            }
        },
        "filtering": {
            "GET /api/sales/sales/?type=sales": "Show only sales",
            "GET /api/sales/sales/?type=returns": "Show only returns",
            "GET /api/sales/sales/?customer=1": "Filter by customer",
            "GET /api/sales/sales/?status=unpaid": "Filter by status"
        },
        "notes": {
            "currencies": "Supported: AFN, USD, PKR, CNY",
            "status_options": "unpaid, partial, paid",
            "returns": "Returns are stored as negative amounts",
            "adjustments": "Create new transactions, don't modify originals"
        }
    })