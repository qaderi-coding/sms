from decimal import Decimal
from django.utils import timezone
from .models import ExchangeRate, Currency

def get_latest_exchange_rate(from_currency, to_currency='AFN'):
    """Get the latest exchange rate from database"""
    if from_currency == to_currency:
        return Decimal('1.0')
    
    try:
        # Get the most recent exchange rate
        rate = ExchangeRate.objects.filter(
            from_currency_id=from_currency,
            to_currency_id=to_currency
        ).order_by('-date', '-created_at').first()
        
        if rate:
            return rate.rate
        else:
            # If no rate found, try reverse rate
            reverse_rate = ExchangeRate.objects.filter(
                from_currency_id=to_currency,
                to_currency_id=from_currency
            ).order_by('-date', '-created_at').first()
            
            if reverse_rate and reverse_rate.rate != 0:
                return Decimal('1.0') / reverse_rate.rate
            
            # Default to 1.0 if no rate found
            return Decimal('1.0')
    except Exception:
        return Decimal('1.0')

def convert_currency(amount, from_currency, to_currency='AFN'):
    """Convert amount from one currency to another"""
    if from_currency == to_currency:
        return amount, Decimal('1.0')
    
    exchange_rate = get_latest_exchange_rate(from_currency, to_currency)
    converted_amount = amount * exchange_rate
    
    return converted_amount, exchange_rate

def validate_currency(currency_code):
    """Validate if currency exists in database"""
    return Currency.objects.filter(code=currency_code).exists()