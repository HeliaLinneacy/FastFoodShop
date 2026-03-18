from django.contrib import admin
from .models import (
    CustomUser, Category, Product, Review, Order, OrderItem, Cart, CartItem
)


# Minimal admin registration - no custom configuration
admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Cart)
admin.site.register(CartItem)


# Custom Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_email', 'total', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'customer_phone')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at', 'total')
    
    fieldsets = (
        ('Thông tin đơn hàng', {
            'fields': ('id', 'user', 'status', 'total', 'created_at', 'updated_at')
        }),
        ('Thông tin khách hàng', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'customer_address')
        }),
        ('Ghi chú', {
            'fields': ('note',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('user',)
        return self.readonly_fields

# Custom OrderItem Admin
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product_name', 'quantity', 'price', 'subtotal')
    list_filter = ('order__status', 'order__created_at')
    search_fields = ('product_name', 'order__customer_name')
    readonly_fields = ('subtotal',)

