from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def purchase_endpoints(request):
    """Show available purchase endpoints with request body examples"""
    return Response({
        "message": "Purchases API - Actual Request Body Structure",
        "endpoints": {
            "POST /api/purchases/bulk-create/": {
                "required_fields": {
                    "supplier_id": "integer - Supplier ID",
                    "currency": "string - AFN, USD, PKR, CNY",
                    "items": "array - List of purchase items"
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
                    "supplier_id": 1,
                    "currency": "AFN",
                    "items": [
                        {
                            "product_id": 1,
                            "quantity": 10,
                            "unit_price_entered": 100.00
                        }
                    ],
                    "notes": "Optional purchase notes"
                }
            },
            "POST /api/purchases/bulk-return/": {
                "required_fields": {
                    "supplier_id": "integer - Supplier ID",
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
                    "supplier_id": 1,
                    "currency": "AFN",
                    "items": [
                        {
                            "product_id": 1,
                            "quantity": 5,
                            "unit_price_entered": 100.00
                        }
                    ],
                    "notes": "Defective items"
                }
            }
        },
        "filtering": {
            "GET /api/purchases/purchases/?type=purchases": "Show only purchases",
            "GET /api/purchases/purchases/?type=returns": "Show only returns",
            "GET /api/purchases/purchases/?supplier=1": "Filter by supplier",
            "GET /api/purchases/purchases/?status=unpaid": "Filter by status"
        },
        "notes": {
            "currencies": "Supported: AFN, USD, PKR, CNY",
            "status_options": "unpaid, partial, paid",
            "returns": "Returns are stored as negative amounts",
            "adjustments": "Create new transactions, don't modify originals"
        }
    })