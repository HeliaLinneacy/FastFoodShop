from django.urls import path
from . import views

app_name = 'shop'

# Authentication URLs
auth_patterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]

# Shop URLs
shop_patterns = [
    path('', views.home, name='home'),
    path('products/', views.product_list, name='product_list'),
    path('products/<int:product_id>/', views.product_detail, name='product_detail'),
    path('products/<int:product_id>/buy-now/', views.buy_now, name='buy_now'),
]

# Cart URLs
cart_patterns = [
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item, name='update_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
]

# Order URLs
order_patterns = [
    path('checkout/', views.checkout, name='checkout'),
    path('orders/', views.order_list, name='orders'),
    path('orders/<int:order_id>/', views.order_detail, name='order_detail'),
]

# Profile URLs
profile_patterns = [
    path('profile/', views.profile, name='profile'),
]

# Admin URLs
admin_patterns = [
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/products/', views.admin_products, name='admin_products'),
    path('admin/orders/', views.admin_orders, name='admin_orders'),
    path('admin/categories/', views.admin_categories, name='admin_categories'),
    path('admin/users/', views.admin_users, name='admin_users'),
    path('admin/statistics/', views.admin_statistics, name='admin_statistics'),
]

urlpatterns = auth_patterns + shop_patterns + cart_patterns + order_patterns + profile_patterns + admin_patterns
