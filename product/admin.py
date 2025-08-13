from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'rate', 'count', 'get_username', 'created_at')
    list_filter = ('category', 'rate', 'created_at')
    search_fields = ('title', 'category', 'description', 'user__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    def get_username(self, obj):
        return obj.user.username  # Access username from related User model
    get_username.short_description = 'Username'  # Column title in admin
    get_username.admin_order_field = 'user__username'  # Allow ordering by username




