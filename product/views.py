from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Product
import requests
import json

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
                # If product exists, increment the quantity
                existing_product.quantity += 1
                existing_product.save()
                return JsonResponse({
                    'status': 'success',
                    'message': f'Product quantity updated! Now you have {existing_product.quantity} of this item.',
                    'product_id': existing_product.id,
                    'quantity': existing_product.quantity
                })
            
            # Create new product with quantity 1
            product = Product.objects.create(
                user=request.user,
                title=data.get('title'),
                price=data.get('price'),
                description=data.get('description'),
                category=data.get('category'),
                image_url=data.get('image'),
                rate=data.get('rating', {}).get('rate', 0),
                count=data.get('rating', {}).get('count', 0),
                quantity=1
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Product added successfully!',
                'product_id': product.id,
                'quantity': product.quantity
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to add product'
            })
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
def update_product_quantity(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            action = data.get('action')  # 'increase', 'decrease', or 'remove'
            
            product = Product.objects.get(id=product_id, user=request.user)
            
            if action == 'increase':
                product.quantity += 1
                product.save()
                return JsonResponse({
                    'status': 'success',
                    'message': f'Quantity increased to {product.quantity}',
                    'quantity': product.quantity
                })
            elif action == 'decrease':
                if product.quantity > 1:
                    product.quantity -= 1
                    product.save()
                    return JsonResponse({
                        'status': 'success',
                        'message': f'Quantity decreased to {product.quantity}',
                        'quantity': product.quantity
                    })
                else:
                    product.delete()
                    return JsonResponse({
                        'status': 'success',
                        'message': 'Product removed from collection',
                        'quantity': 0
                    })
            elif action == 'remove':
                product.delete()
                return JsonResponse({
                    'status': 'success',
                    'message': 'Product removed from collection',
                    'quantity': 0
                })
            
        except Product.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Product not found'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to update product quantity'
            })
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
