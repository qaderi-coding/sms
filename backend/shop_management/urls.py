from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Shop Management API",
      default_version='v1',
      description="API for spare parts shop management system",
      contact=openapi.Contact(email="admin@shopmanagement.com"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
from rest_framework_simplejwt.views import TokenRefreshView
from core.auth import CustomTokenObtainPairView, user_profile

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/', user_profile, name='user_profile'),
    path('api/core/', include('core.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/parties/', include('parties.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/purchases/', include('purchases.urls')),
    path('api/expenses/', include('expenses.urls')),
    path('api/loans/', include('loans.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/docs/', include('core.urls')),
    
    # Swagger documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]