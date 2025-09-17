#!/usr/bin/env python
"""
Simple script to test all API endpoints
Run: python test_endpoints.py
"""

import requests
import json

BASE_URL = 'http://localhost:8000'

# Test endpoints
endpoints = [
    '/api/core/currencies/',
    '/api/core/exchange-rates/',
    '/api/core/transactions/',
    '/api/inventory/units/',
    '/api/inventory/categories/',
    '/api/inventory/companies/',
    '/api/inventory/bike-models/',
    '/api/inventory/products/',
    '/api/inventory/product-items/',
    '/api/parties/customers/',
    '/api/parties/suppliers/',
    '/api/sales/sales/',
    '/api/sales/sale-items/',
    '/api/purchases/purchases/',
    '/api/purchases/purchase-items/',
    '/api/payments/payments/',
    '/api/loans/loans/',
    '/api/expenses/expenses/',
    '/api/reports/dashboard/',
    '/api/core/docs/',
]

def test_endpoints():
    print("Testing API Endpoints...")
    print("=" * 50)
    
    # First get auth token
    try:
        login_response = requests.post(f'{BASE_URL}/api/auth/login/', {
            'username': 'admin',  # Change this
            'password': 'admin'   # Change this
        })
        
        if login_response.status_code == 200:
            token = login_response.json().get('access')
            headers = {'Authorization': f'Bearer {token}'}
            print("✅ Authentication successful")
        else:
            print("❌ Authentication failed - using no auth")
            headers = {}
    except:
        print("❌ Could not authenticate - using no auth")
        headers = {}
    
    print()
    
    # Test each endpoint
    for endpoint in endpoints:
        try:
            response = requests.get(f'{BASE_URL}{endpoint}', headers=headers, timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {endpoint}")
            elif response.status_code == 401:
                print(f"🔒 {endpoint} (Authentication required)")
            elif response.status_code == 404:
                print(f"❌ {endpoint} (Not found)")
            else:
                print(f"⚠️  {endpoint} (Status: {response.status_code})")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} (Connection error)")
    
    print()
    print("=" * 50)
    print("Test completed!")

if __name__ == '__main__':
    test_endpoints()