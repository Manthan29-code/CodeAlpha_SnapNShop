from django.urls import path
from .views import *

urlpatterns = [
    path("", allProduct, name="allProduct"),
    path("add/", add_product, name="add_product"),
    path("update-quantity/", update_product_quantity, name="update_product_quantity"),
]
