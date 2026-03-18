from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST

@login_required
@require_POST
def buy_now(request, product_id):
    """Thêm sản phẩm vào giỏ và chuyển hướng đến trang thanh toán ngay lập tức."""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    quantity = int(request.POST.get('quantity', 1))

    # Xóa các sản phẩm khác khỏi giỏ để chỉ thanh toán sản phẩm này (tùy chọn)
    cart.items.all().delete()

    # Thêm sản phẩm với số lượng mới
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        cart_item.quantity = quantity
        cart_item.save()

    return redirect('shop:checkout')
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from .models import (
    Product, Category, Review, Order, OrderItem, Cart, CartItem, CustomUser
)
from .forms import (
    CustomUserCreationForm, CustomUserChangeForm, CustomAuthenticationForm,
    ReviewForm, OrderForm
)


# Authentication Views
def register(request):
    """User registration view."""
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            # Create cart for new user
            Cart.objects.create(user=user)
            messages.success(request, 'Registration successful! Please log in.')
            return redirect('shop:login')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'shop/register.html', {'form': form})


def login_view(request):
    """User login view."""
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            next_url = request.GET.get('next', 'shop:home')
            return redirect(next_url)
    else:
        form = CustomAuthenticationForm()
    
    return render(request, 'shop/login.html', {'form': form})


def logout_view(request):
    """User logout view."""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('shop:home')


# Shop Views
def home(request):
    """Homepage view - displays featured products."""
    featured_products = Product.objects.filter(is_active=True)[:8]
    categories = Category.objects.all()[:6]
    
    cart_count = 0
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.get_item_count()
    
    context = {
        'featured_products': featured_products,
        'categories': categories,
        'cart_count': cart_count,
    }
    return render(request, 'shop/home.html', context)


def product_list(request):
    """Product list view with filtering and pagination."""
    products = Product.objects.filter(is_active=True)
    categories = Category.objects.all()
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category_id=category_id)
    
    # Search
    search_query = request.GET.get('search', '')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Sort
    sort = request.GET.get('sort', '-created_at')
    products = products.order_by(sort)
    
    # Pagination
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'products': page_obj.object_list,
        'categories': categories,
        'selected_category': category_id,
        'search_query': search_query,
    }
    
    cart_count = 0
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.get_item_count()
    context['cart_count'] = cart_count
    
    return render(request, 'shop/product_list.html', context)


def product_detail(request, product_id):
    """Product detail view."""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    reviews = product.reviews.all().order_by('-created_at')
    related_products = Product.objects.filter(
        category=product.category,
        is_active=True
    ).exclude(id=product_id)[:4]
    
    review_form = None
    user_review = None
    
    if request.user.is_authenticated:
        user_review = product.reviews.filter(user=request.user).first()
        
        if request.method == 'POST':
            if 'submit_review' in request.POST:
                review_form = ReviewForm(request.POST)
                if review_form.is_valid():
                    if user_review:
                        # Update existing review
                        user_review.rating = review_form.cleaned_data['rating']
                        user_review.comment = review_form.cleaned_data['comment']
                        user_review.save()
                    else:
                        # Create new review
                        review = review_form.save(commit=False)
                        review.product = product
                        review.user = request.user
                        review.save()
                    messages.success(request, 'Review submitted successfully!')
                    return redirect('shop:product_detail', product_id=product.id)
        else:
            review_form = ReviewForm()
    
    context = {
        'product': product,
        'reviews': reviews,
        'related_products': related_products,
        'review_form': review_form,
        'user_review': user_review,
    }
    
    cart_count = 0
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.get_item_count()
    context['cart_count'] = cart_count
    
    return render(request, 'shop/product_detail.html', context)


# Cart Views
@login_required
def cart_view(request):
    """Shopping cart view."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart_items = cart.items.all()
    
    context = {
        'cart': cart,
        'cart_items': cart_items,
        'total': cart.get_total(),
        'cart_count': cart.get_item_count(),
    }
    return render(request, 'shop/cart.html', context)


@login_required
@require_http_methods(['POST'])
def add_to_cart(request, product_id):
    """Add product to cart."""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    
    quantity = int(request.POST.get('quantity', 1))
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    messages.success(request, f'{product.name} added to cart!')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'message': 'Added to cart'})
    
    return redirect('shop:product_detail', product_id=product.id)


@login_required
@require_http_methods(['POST'])
def update_cart_item(request, item_id):
    """Update cart item quantity."""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    quantity = int(request.POST.get('quantity', 1))
    
    if quantity > 0:
        cart_item.quantity = quantity
        cart_item.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    return redirect('shop:cart')


@login_required
@require_http_methods(['POST'])
def remove_from_cart(request, item_id):
    """Remove item from cart."""
    cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
    cart_item.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    return redirect('shop:cart')


# Order Views
@login_required
def checkout(request):
    """Checkout view."""
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart_items = cart.items.all()
    
    if not cart_items.exists():
        messages.warning(request, 'Your cart is empty!')
        return redirect('shop:cart')
    
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.total = cart.get_total()
            order.payment_method = form.cleaned_data['payment_method']
            order.save()

            # Create order items
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_image=cart_item.product.image,
                    price=cart_item.product.price,
                    quantity=cart_item.quantity,
                )

            # Clear cart
            cart_items.delete()

            messages.success(request, 'Order placed successfully!')
            return redirect('shop:order_detail', order_id=order.id)
    else:
        form = OrderForm(initial={
            'customer_name': request.user.get_full_name(),
            'customer_email': request.user.email,
            'customer_phone': request.user.phone,
            'customer_address': request.user.address,
        })
    
    context = {
        'form': form,
        'cart': cart,
        'cart_items': cart_items,
        'total': cart.get_total(),
        'cart_count': cart.get_item_count(),
    }
    return render(request, 'shop/checkout.html', context)


@login_required
def order_list(request):
    """User orders list view."""
    orders = request.user.orders.all().order_by('-created_at')
    
    cart_count = 0
    cart = Cart.objects.filter(user=request.user).first()
    if cart:
        cart_count = cart.get_item_count()
    
    context = {
        'orders': orders,
        'cart_count': cart_count,
    }
    return render(request, 'shop/orders.html', context)


@login_required
def order_detail(request, order_id):
    """Order detail view."""
    order = get_object_or_404(Order, id=order_id)
    
    # Allow order user or staff to view
    if request.user != order.user and not request.user.is_staff:
        raise PermissionDenied
    
    # Handle status update for staff
    if request.method == 'POST' and request.user.is_staff:
        new_status = request.POST.get('status')
        if new_status in dict(Order.ORDER_STATUS_CHOICES):
            order.status = new_status
            order.save()
            messages.success(request, f'Cập nhật trạng thái đơn hàng thành công!')
            return redirect('shop:order_detail', order_id=order.id)
    
    cart_count = 0
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_count = cart.get_item_count()
    
    context = {
        'order': order,
        'items': order.items.all(),
        'cart_count': cart_count,
        'status_choices': Order.ORDER_STATUS_CHOICES,
    }
    return render(request, 'shop/order_detail.html', context)


# Profile Views
@login_required
def profile(request):
    """User profile view."""
    if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('shop:profile')
    else:
        form = CustomUserChangeForm(instance=request.user)
    
    recent_orders = request.user.orders.all().order_by('-created_at')[:5]
    
    cart_count = 0
    cart = Cart.objects.filter(user=request.user).first()
    if cart:
        cart_count = cart.get_item_count()
    
    context = {
        'form': form,
        'recent_orders': recent_orders,
        'cart_count': cart_count,
    }
    return render(request, 'shop/profile.html', context)


# Admin Views
def is_admin(user):
    """Check if user is admin."""
    return user.is_staff or user.role == 'admin'


@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Admin dashboard view."""
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_users = CustomUser.objects.count()
    total_revenue = sum(order.total for order in Order.objects.filter(status__in=['confirmed', 'shipping', 'delivered']))
    
    recent_orders = Order.objects.all().order_by('-created_at')[:5]
    recent_products = Product.objects.all().order_by('-created_at')[:5]
    
    context = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'total_revenue': total_revenue,
        'recent_orders': recent_orders,
        'recent_products': recent_products,
    }
    return render(request, 'admin/dashboard.html', context)


@login_required
@user_passes_test(is_admin)
def admin_products(request):
    """Admin products management view."""
    products = Product.objects.all().order_by('-created_at')
    
    context = {
        'products': products,
    }
    return render(request, 'admin/products.html', context)


@login_required
@user_passes_test(is_admin)
def admin_orders(request):
    """Admin orders management view."""
    orders = Order.objects.all().order_by('-created_at')
    
    status_filter = request.GET.get('status')
    if status_filter:
        orders = orders.filter(status=status_filter)
    
    context = {
        'orders': orders,
        'status_choices': Order._meta.get_field('status').choices,
    }
    return render(request, 'admin/orders.html', context)


@login_required
@user_passes_test(is_admin)
def admin_categories(request):
    """Admin categories management view."""
    categories = Category.objects.all().order_by('name')
    
    context = {
        'categories': categories,
    }
    return render(request, 'admin/categories.html', context)


@login_required
@user_passes_test(is_admin)
def admin_users(request):
    """Admin users management view."""
    users = CustomUser.objects.all().order_by('-date_joined')
    
    context = {
        'users': users,
    }
    return render(request, 'admin/users.html', context)


@login_required
@user_passes_test(is_admin)
def admin_statistics(request):
    """Admin statistics view."""
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_users = CustomUser.objects.filter(role='user').count()
    total_revenue = sum(order.total for order in Order.objects.filter(status__in=['confirmed', 'shipping', 'delivered']))
    
    pending_orders = Order.objects.filter(status='pending').count()
    confirmed_orders = Order.objects.filter(status='confirmed').count()
    shipping_orders = Order.objects.filter(status='shipping').count()
    delivered_orders = Order.objects.filter(status='delivered').count()
    
    context = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_users': total_users,
        'total_revenue': total_revenue,
        'pending_orders': pending_orders,
        'confirmed_orders': confirmed_orders,
        'shipping_orders': shipping_orders,
        'delivered_orders': delivered_orders,
    }
    return render(request, 'admin/statistics.html', context)
