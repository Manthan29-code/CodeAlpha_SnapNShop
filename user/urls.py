from django.urls import path
from .views import *

urlpatterns = [
    path('', landing_view, name='front_view'),
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('logout/', logout_view, name='logout'),
]
