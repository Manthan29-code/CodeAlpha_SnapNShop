from django.db import models
from django.conf import settings


class Product(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  
        on_delete=models.CASCADE,
        related_name='products'
    )

    title = models.CharField(max_length=255)  
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500) 

    # Rating fields from API
    rate = models.DecimalField(max_digits=3, decimal_places=1) 
    count = models.PositiveIntegerField()  

    # Quantity field for user's cart/collection
    quantity = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (Qty: {self.quantity}) - {self.user.username}"

    class Meta:
        verbose_name_plural = "Products"

