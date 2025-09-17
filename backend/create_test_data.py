#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_management.settings')
django.setup()

from core.models import Currency, ExchangeRate
from parties.models import Customer, Supplier
from inventory.models import Unit, Category, Company, BikeModel, Product
from django.contrib.auth.models import User
from datetime import date

def create_test_data():
    print("Creating test data...")
    
    # Create currencies
    currencies = [
        {'code': 'AFN', 'name': 'Afghan Afghani', 'symbol': '؋'},
        {'code': 'USD', 'name': 'US Dollar', 'symbol': '$'},
        {'code': 'PKR', 'name': 'Pakistani Rupee', 'symbol': '₨'},
        {'code': 'CNY', 'name': 'Chinese Yuan', 'symbol': '¥'},
    ]
    
    for curr_data in currencies:
        currency, created = Currency.objects.get_or_create(
            code=curr_data['code'],
            defaults=curr_data
        )
        if created:
            print(f"Created currency: {currency.code}")
    
    # Create exchange rates
    afn = Currency.objects.get(code='AFN')
    usd = Currency.objects.get(code='USD')
    pkr = Currency.objects.get(code='PKR')
    cny = Currency.objects.get(code='CNY')
    
    rates = [
        {'from_currency': usd, 'to_currency': afn, 'rate': 70.0, 'date': date.today()},
        {'from_currency': pkr, 'to_currency': afn, 'rate': 0.25, 'date': date.today()},
        {'from_currency': cny, 'to_currency': afn, 'rate': 10.0, 'date': date.today()},
        {'from_currency': afn, 'to_currency': afn, 'rate': 1.0, 'date': date.today()},
    ]
    
    for rate_data in rates:
        rate, created = ExchangeRate.objects.get_or_create(
            from_currency=rate_data['from_currency'],
            to_currency=rate_data['to_currency'],
            date=rate_data['date'],
            defaults={'rate': rate_data['rate']}
        )
        if created:
            print(f"Created exchange rate: {rate}")
    
    # Create test customer
    customer, created = Customer.objects.get_or_create(
        name="Test Customer",
        defaults={
            'phone': '+93701234567',
            'address': 'Kabul, Afghanistan'
        }
    )
    if created:
        print(f"Created customer: {customer.name}")
    
    # Create test supplier
    supplier, created = Supplier.objects.get_or_create(
        name="Test Supplier",
        defaults={
            'phone': '+93701234568',
            'address': 'Herat, Afghanistan'
        }
    )
    if created:
        print(f"Created supplier: {supplier.name}")
    
    # Create inventory data
    unit, created = Unit.objects.get_or_create(
        name="Piece",
        defaults={'symbol': 'pc'}
    )
    if created:
        print(f"Created unit: {unit.name}")
    
    category, created = Category.objects.get_or_create(
        name="Engine Parts",
        defaults={'description': 'Motorcycle engine components'}
    )
    if created:
        print(f"Created category: {category.name}")
    
    company, created = Company.objects.get_or_create(
        name="Honda",
        defaults={'country': 'Japan'}
    )
    if created:
        print(f"Created company: {company.name}")
    
    bike_model, created = BikeModel.objects.get_or_create(
        company=company,
        name="C125CC",
        defaults={'description': '125CC Honda motorcycle'}
    )
    if created:
        print(f"Created bike model: {bike_model.name}")
    
    # Create test products
    products = [
        {'name': 'Engine Oil Filter', 'description': 'Oil filter for Honda C125CC'},
        {'name': 'Spark Plug', 'description': 'Spark plug for Honda C125CC'},
        {'name': 'Air Filter', 'description': 'Air filter for Honda C125CC'},
    ]
    
    for prod_data in products:
        product, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'category': category,
                'company': company,
                'bike_model': bike_model,
                'base_unit': unit,
                'description': prod_data['description']
            }
        )
        if created:
            print(f"Created product: {product.name}")
    
    # Create superuser if doesn't exist
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@test.com', 'admin123')
        print("Created admin user: admin/admin123")
    
    print("\nTest data created successfully!")
    print("\nYou can now use these IDs in Swagger:")
    print(f"Customer ID: {Customer.objects.first().id}")
    print(f"Supplier ID: {Supplier.objects.first().id}")
    for i, product in enumerate(Product.objects.all()[:3], 1):
        print(f"Product {i} ID: {product.id} - {product.name}")

if __name__ == '__main__':
    create_test_data()