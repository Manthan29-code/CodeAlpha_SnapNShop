from django.shortcuts import render

# Create your views here.

def allProduct(request):
    return render(request , 'product/allProduct.html')
