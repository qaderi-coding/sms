from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import *

class ShopModelTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            category=self.category,
            name="Test Product",
            sku="TEST001"
        )
        self.customer = Customer.objects.create(
            name="Test Customer",
            phone="1234567890"
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.category, self.category)

    def test_customer_creation(self):
        self.assertEqual(self.customer.name, "Test Customer")

class ShopAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_category_list(self):
        Category.objects.create(name="Test Category")
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)

    def test_product_list(self):
        category = Category.objects.create(name="Test Category")
        Product.objects.create(
            category=category,
            name="Test Product",
            sku="TEST001"
        )
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)