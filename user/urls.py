from django.urls import path
from .views import *

urlpatterns = [
    path('user/' ,landing_view, name='front_view'),
    # path('login/' ,front_view, name='front_view'),
    # path('signup/' ,front_view, name='front_view'),
]
