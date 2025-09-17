from rest_framework import serializers
from .models import Unit, Category, Company, BikeModel, Product, ProductUnitConversion, ProductItem, StockMovement

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class BikeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BikeModel
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductUnitConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductUnitConversion
        fields = '__all__'

class ProductItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductItem
        fields = '__all__'

class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'