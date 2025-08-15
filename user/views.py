from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.db import IntegrityError
from .models import User

def landing_view(request):
    return render(request, 'base.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')
        
        if not username or not password:
            messages.error(request, 'Please enter both username/email and password.')
            return render(request, 'user/login.html')
        
        # Try to authenticate with username first, then email
        user = authenticate(request, username=username, password=password)
        
        if not user:
            # Try to find user by email and authenticate
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                # Check if the user exists but password is wrong
                user_exists_by_username = User.objects.filter(username__iexact=username).exists()
                user_exists_by_email = User.objects.filter(email__iexact=username).exists()
                
                if user_exists_by_username or user_exists_by_email:
                    messages.error(request, 'Invalid password. Please check your password and try again.')
                else:
                    messages.error(request, f'No account found with username/email "{username}". <a href="{request.build_absolute_uri("/register/")}" class="text-primary-custom">Create an account</a>?')
                
                return render(request, 'user/login.html')
        
        if user is not None:
            auth_login(request, user)
            
            # Set session expiry based on remember me
            if not remember_me:
                request.session.set_expiry(0)  # Session expires when browser closes
            
            messages.success(request, f'Welcome back, {user.name}!')
            
            # Redirect based on user role
            if user.role == 'vendor':
                return redirect('vendor_dashboard')  # Create this URL later
            else:
                return redirect('front_view')  # Redirect to home page
        else:
            messages.error(request, 'Invalid credentials. Please check your username/email and password.')
    
    return render(request, 'user/login.html')

def register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        role = request.POST.get('role', 'customer')
        terms = request.POST.get('terms')
        
        # Validation
        errors = []
        
        if not all([name, username, email, password, confirm_password]):
            errors.append('All fields are required.')
        
        if password != confirm_password:
            errors.append('Passwords do not match.')
        
        if len(password) < 8:
            errors.append('Password must be at least 8 characters long.')
        
        if not terms:
            errors.append('You must accept the terms and conditions.')
        
        # Check if username already exists (case-insensitive)
        if User.objects.filter(username__iexact=username).exists():
            errors.append(f'Username "{username}" is already taken. Please choose a different username.')
        
        # Check if email already exists (case-insensitive)
        if User.objects.filter(email__iexact=email).exists():
            errors.append(f'Email "{email}" is already registered. Please use a different email address or <a href="{request.build_absolute_uri("/login/")}" class="text-primary-custom">login here</a>.')
        
        # Additional validations
        if len(username) < 3:
            errors.append('Username must be at least 3 characters long.')
        
        if not username.replace('_', '').replace('-', '').isalnum():
            errors.append('Username can only contain letters, numbers, hyphens, and underscores.')
        
        # Email format validation (basic)
        if '@' not in email or '.' not in email.split('@')[-1]:
            errors.append('Please enter a valid email address.')
        
        if errors:
            for error in errors:
                messages.error(request, error)
            
            # Return the form with the data to preserve user input
            context = {
                'form_data': {
                    'name': name,
                    'username': username,
                    'email': email,
                    'role': role,
                }
            }
            return render(request, 'user/register.html', context)
        
        try:
            # Create new user
            user = User.objects.create(
                name=name,
                username=username,
                email=email,
                password=make_password(password),  # Hash the password
                role=role
            )
            
            # Log the user in automatically after registration
            user = authenticate(request, username=username, password=password)
            if user:
                auth_login(request, user)
                messages.success(request, f'Welcome to SnapNShop, {name}! Your account has been created successfully.')
                
                # Redirect based on role
                if role == 'vendor':
                    # messages.info(request, 'As a vendor, you can start adding your products after account verification.')
                    return redirect('front_view')  # Create this URL later
                else:
                    return redirect('front_view')
            
        except IntegrityError as e:
            messages.error(request, 'An error occurred while creating your account. This username or email might already be in use. Please try again with different credentials.')
            return render(request, 'user/register.html')
    
    return render(request, 'user/register.html')

def logout_view(request):
    auth_logout(request)
    # messages.success(request, 'You have been logged out successfully.')
    return redirect('front_view')

def profile_view(request):
    if not request.user.is_authenticated:
        messages.error(request, 'You need to be logged in to view your profile.')
        return redirect('login')
    
    user = request.user
    
    # Handle POST request for updating profile
    if request.method == 'POST':
        name = request.POST.get('name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        
        # Validation
        errors = []
        
        if not all([name, username, email]):
            errors.append('All fields are required.')
        
        # Check if username already exists for other users
        if User.objects.filter(username__iexact=username).exclude(id=user.id).exists():
            errors.append(f'Username "{username}" is already taken by another user.')
        
        # Check if email already exists for other users
        if User.objects.filter(email__iexact=email).exclude(id=user.id).exists():
            errors.append(f'Email "{email}" is already registered by another user.')
        
        # Additional validations
        if len(username) < 3:
            errors.append('Username must be at least 3 characters long.')
        
        if not username.replace('_', '').replace('-', '').isalnum():
            errors.append('Username can only contain letters, numbers, hyphens, and underscores.')
        
        # Email format validation (basic)
        if '@' not in email or '.' not in email.split('@')[-1]:
            errors.append('Please enter a valid email address.')
        
        if errors:
            for error in errors:
                messages.error(request, error)
        else:
            try:
                # Update user information
                user.name = name
                user.username = username
                user.email = email
                user.save()
                
                messages.success(request, 'Your profile has been updated successfully!')
                return redirect('profile')
            except IntegrityError:
                messages.error(request, 'An error occurred while updating your profile. Please try again.')
    
    # Get user's products and statistics
    user_products = user.products.all().order_by('-created_at')
    
    # USD to INR conversion rate
    # USD_TO_INR_RATE = 83
    
    # Calculate statistics (convert USD prices to INR)
    total_products = user_products.count()
    total_quantity = sum(product.quantity for product in user_products)
    total_spent = sum((product.price) * product.quantity for product in user_products)
    
    # Category statistics
    category_stats = {}
    for product in user_products:
        category = product.category
        inr_price = product.price
        if category in category_stats:
            category_stats[category]['count'] += product.quantity
            category_stats[category]['amount'] += inr_price * product.quantity
        else:
            category_stats[category] = {
                'count': product.quantity,
                'amount': inr_price * product.quantity
            }
    
    # Most purchased category
    most_purchased_category = max(category_stats.items(), key=lambda x: x[1]['count'])[0] if category_stats else None
    
    # Average product price (in INR)
    average_price = total_spent / total_quantity if total_quantity > 0 else 0
    
    context = {
        'user': user,
        'user_products': user_products,
        'total_products': total_products,
        'total_quantity': total_quantity,
        'total_spent': total_spent,
        'category_stats': category_stats,
        'most_purchased_category': most_purchased_category,
        'average_price': average_price,
    }
    
    return render(request, 'user/profile.html', context)
