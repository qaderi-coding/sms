from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal

from core.models import Currency, ExchangeRate, Transaction
from inventory.models import Unit, Category, Company, BikeModel, Product, ProductUnitConversion, ProductItem
from parties.models import Customer, Supplier
from sales.models import Sale, SaleItem
from purchases.models import Purchase, PurchaseItem
from payments.models import Payment
from loans.models import Loan
from expenses.models import Expense

class Command(BaseCommand):
    help = 'Seed database with dummy data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create Currencies
        currencies = [
            {'code': 'AFN', 'name': 'Afghan Afghani', 'symbol': '؋'},
            {'code': 'USD', 'name': 'US Dollar', 'symbol': '$'},
            {'code': 'PKR', 'name': 'Pakistani Rupee', 'symbol': '₨'},
            {'code': 'CNY', 'name': 'Chinese Yuan', 'symbol': '¥'},
        ]
        
        for curr_data in currencies:
            Currency.objects.get_or_create(
                code=curr_data['code'],
                defaults=curr_data
            )

        # Create Exchange Rates
        today = date.today()
        rates = [
            {'from': 'USD', 'to': 'AFN', 'rate': Decimal('70.50')},
            {'from': 'PKR', 'to': 'AFN', 'rate': Decimal('0.25')},
            {'from': 'CNY', 'to': 'AFN', 'rate': Decimal('9.80')},
            {'from': 'AFN', 'to': 'AFN', 'rate': Decimal('1.00')},
        ]
        
        for rate_data in rates:
            ExchangeRate.objects.get_or_create(
                from_currency_id=rate_data['from'],
                to_currency_id=rate_data['to'],
                date=today,
                defaults={'rate': rate_data['rate']}
            )

        # Create Units
        units = [
            {'name': 'Piece', 'symbol': 'pc'},
            {'name': 'Carton', 'symbol': 'ctn'},
            {'name': 'Kilogram', 'symbol': 'kg'},
            {'name': 'Liter', 'symbol': 'L'},
        ]
        
        for unit_data in units:
            Unit.objects.get_or_create(
                name=unit_data['name'],
                defaults=unit_data
            )

        # Create Categories
        categories = [
            {'name': 'Engine Parts', 'description': 'Engine related spare parts'},
            {'name': 'Tires', 'description': 'Motorcycle tires'},
            {'name': 'Oils & Lubricants', 'description': 'Engine oils and lubricants'},
            {'name': 'Electrical', 'description': 'Electrical components'},
        ]
        
        for cat_data in categories:
            Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )

        # Create Companies
        companies = [
            {'name': 'Honda', 'country': 'Japan'},
            {'name': 'Yamaha', 'country': 'Japan'},
            {'name': 'Suzuki', 'country': 'Japan'},
            {'name': 'Lifan', 'country': 'China'},
        ]
        
        for comp_data in companies:
            Company.objects.get_or_create(
                name=comp_data['name'],
                defaults=comp_data
            )

        # Create Bike Models
        honda = Company.objects.get(name='Honda')
        yamaha = Company.objects.get(name='Yamaha')
        
        models = [
            {'company': honda, 'name': 'C70CC', 'description': 'Honda 70CC model'},
            {'company': honda, 'name': 'C125CC', 'description': 'Honda 125CC model'},
            {'company': yamaha, 'name': 'YBR125', 'description': 'Yamaha 125CC model'},
        ]
        
        for model_data in models:
            BikeModel.objects.get_or_create(
                company=model_data['company'],
                name=model_data['name'],
                defaults=model_data
            )

        # Create Products
        piece_unit = Unit.objects.get(name='Piece')
        engine_cat = Category.objects.get(name='Engine Parts')
        c70_model = BikeModel.objects.get(name='C70CC')
        
        products = [
            {'name': 'Piston Ring Set', 'category': engine_cat, 'company': honda, 'bike_model': c70_model, 'base_unit': piece_unit},
            {'name': 'Spark Plug', 'category': engine_cat, 'company': honda, 'bike_model': c70_model, 'base_unit': piece_unit},
            {'name': 'Air Filter', 'category': engine_cat, 'company': honda, 'bike_model': c70_model, 'base_unit': piece_unit},
        ]
        
        for prod_data in products:
            Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=prod_data
            )

        # Create Customers
        customers = [
            {'name': 'Ahmad Khan', 'phone': '+93701234567', 'address': 'Kabul, Afghanistan'},
            {'name': 'Mohammad Ali', 'phone': '+93701234568', 'address': 'Herat, Afghanistan'},
            {'name': 'Hassan Ahmadi', 'phone': '+93701234569', 'address': 'Mazar, Afghanistan'},
        ]
        
        for cust_data in customers:
            Customer.objects.get_or_create(
                name=cust_data['name'],
                defaults=cust_data
            )

        # Create Suppliers
        suppliers = [
            {'name': 'Honda Parts Supplier', 'phone': '+93701111111', 'address': 'Kabul, Afghanistan'},
            {'name': 'China Parts Import', 'phone': '+93701111112', 'address': 'Kabul, Afghanistan'},
        ]
        
        for supp_data in suppliers:
            Supplier.objects.get_or_create(
                name=supp_data['name'],
                defaults=supp_data
            )

        # Create Sample Transactions
        customer = Customer.objects.first()
        supplier = Supplier.objects.first()
        product = Product.objects.first()

        # Sample Sale Transaction
        sale_transaction = Transaction.objects.create(
            type=Transaction.SALE,
            party_type=Transaction.CUSTOMER,
            party_id=customer.id,
            entered_amount=Decimal('500.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('500.00'),
            notes='Sample sale transaction'
        )

        sale = Sale.objects.create(
            transaction=sale_transaction,
            customer=customer,
            total_entered=Decimal('500.00'),
            currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            total_base=Decimal('500.00'),
            status='unpaid'
        )

        SaleItem.objects.create(
            sale=sale,
            product=product,
            quantity=Decimal('2.00'),
            unit_price_entered=Decimal('250.00'),
            currency='AFN',
            unit_price_base=Decimal('250.00')
        )

        # Sample Purchase Transaction
        purchase_transaction = Transaction.objects.create(
            type=Transaction.PURCHASE,
            party_type=Transaction.SUPPLIER,
            party_id=supplier.id,
            entered_amount=Decimal('300.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('300.00'),
            notes='Sample purchase transaction'
        )

        purchase = Purchase.objects.create(
            transaction=purchase_transaction,
            supplier=supplier,
            total_entered=Decimal('300.00'),
            currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            total_base=Decimal('300.00'),
            status='unpaid'
        )

        PurchaseItem.objects.create(
            purchase=purchase,
            product=product,
            quantity=Decimal('3.00'),
            unit_price_entered=Decimal('100.00'),
            currency='AFN',
            unit_price_base=Decimal('100.00')
        )

        # Sample Payment Transaction
        payment_transaction = Transaction.objects.create(
            type=Transaction.PAYMENT_RECEIVED,
            party_type=Transaction.CUSTOMER,
            party_id=customer.id,
            entered_amount=Decimal('200.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('200.00'),
            notes='Partial payment from customer'
        )

        Payment.objects.create(
            transaction=payment_transaction,
            party_type=Transaction.CUSTOMER,
            party_id=customer.id,
            entered_amount=Decimal('200.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('200.00'),
            method='cash'
        )

        # Sample Expense Transaction
        expense_transaction = Transaction.objects.create(
            type=Transaction.EXPENSE,
            party_type=Transaction.NONE,
            entered_amount=Decimal('50.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('50.00'),
            notes='Transport expense'
        )

        Expense.objects.create(
            transaction=expense_transaction,
            category='transport',
            entered_amount=Decimal('50.00'),
            entered_currency='AFN',
            exchange_rate_to_base=Decimal('1.00'),
            amount_base=Decimal('50.00')
        )

        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with dummy data!')
        )