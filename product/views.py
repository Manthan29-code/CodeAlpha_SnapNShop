from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Product
import requests
import json

@login_required
def allProduct(request):
    try:
        # Fetch products from the fake store API
        response = requests.get('https://fakestoreapi.com/products')
        if response.status_code == 200:
            products = response.json()
            context = {'products': products}
        else:
            context = {'products': [], 'error': 'Failed to fetch products'}
    except requests.exceptions.RequestException as e:
        context = {'products': [], 'error': 'Network error occurred'}
    
    return render(request, 'product/allproduct.html', context)

@login_required
# @csrf_exempt
def add_product(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Check if product already exists for this user
            existing_product = Product.objects.filter(
                user=request.user,
                title=data.get('title')
            ).first()
            
            if existing_product:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Product already added to your collection'
                })
            
            # Create new product
            product = Product.objects.create(
                user=request.user,
                title=data.get('title'),
                price=data.get('price'),
                description=data.get('description'),
                category=data.get('category'),
                image_url=data.get('image'),
                rate=data.get('rating', {}).get('rate', 0),
                count=data.get('rating', {}).get('count', 0)
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Product added successfully!',
                'product_id': product.id
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to add product'
            })
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
