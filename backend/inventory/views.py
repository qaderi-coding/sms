from rest_framework import viewsets
from .models import Unit, Category, Company, BikeModel, Product, ProductUnitConversion, ProductItem, StockMovement
from .serializers import UnitSerializer, CategorySerializer, CompanySerializer, BikeModelSerializer, ProductSerializer, ProductUnitConversionSerializer, ProductItemSerializer, StockMovementSerializer

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class BikeModelViewSet(viewsets.ModelViewSet):
    queryset = BikeModel.objects.all()
    serializer_class = BikeModelSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductUnitConversionViewSet(viewsets.ModelViewSet):
    queryset = ProductUnitConversion.objects.all()
    serializer_class = ProductUnitConversionSerializer

class ProductItemViewSet(viewsets.ModelViewSet):
    queryset = ProductItem.objects.all()
    serializer_class = ProductItemSerializer

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer