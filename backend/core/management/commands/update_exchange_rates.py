from django.core.management.base import BaseCommand
from core.models import ExchangeRate, Currency
from datetime import date

class Command(BaseCommand):
    help = 'Update exchange rates'

    def handle(self, *args, **options):
        # Sample exchange rates - replace with actual API call
        rates = {
            'AFN': 70.0,
            'PKR': 280.0,
            'CNY': 7.2,
        }
        
        for currency_code, rate in rates.items():
            ExchangeRate.objects.update_or_create(
                from_currency=currency_code,
                to_currency='USD',
                date=date.today(),
                defaults={'rate': rate}
            )
        
        self.stdout.write(self.style.SUCCESS('Exchange rates updated successfully'))