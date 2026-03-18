# 🎨 Django Snack Shop - Code Style Guide

## Overview
This document outlines the coding standards and best practices for the Django Snack Shop project.

## Python Code Style

### General Principles
- Follow [PEP 8](https://pep8.org/) style guide
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use clear, descriptive names for variables and functions

### Django Model Conventions

```python
# Good
class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, 
                                validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

# Bad
class product(models.Model):
    n = models.CharField()
    p = models.DecimalField()
```

### View Functions

```python
# Good - Clear, descriptive, follows Django conventions
@login_required
def product_detail(request, product_id):
    """Display product details with reviews."""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    reviews = product.reviews.all().order_by('-created_at')
    
    context = {
        'product': product,
        'reviews': reviews,
    }
    return render(request, 'shop/product_detail.html', context)

# Bad - Unclear, no docstring, poor naming
def view1(request, id):
    p = Product.objects.get(id=id)
    r = p.reviews.all()
    return render(request, 'x.html', {'p': p, 'r': r})
```

### URL Patterns

```python
# Good - Descriptive names and clear patterns
urlpatterns = [
    path('products/', views.product_list, name='product_list'),
    path('products/<int:product_id>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
]

# Bad - Unclear, inconsistent naming
urlpatterns = [
    path('prod/', views.prod),
    path('prod/<id>/', views.view1),
    path('c/', views.c),
]
```

### Forms

```python
# Good
class ProductForm(forms.ModelForm):
    """Form for creating and editing products."""
    
    class Meta:
        model = Product
        fields = ('name', 'description', 'price', 'category', 'stock')
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
        }

# Bad
class Productform(forms.Form):
    nm = forms.CharField()
    desc = forms.CharField(widget=forms.Textarea)
```

## Template Style Guide

### HTML Structure

```html
<!-- Good - Proper indentation and structure -->
<div class="container">
    <div class="row">
        {% for product in products %}
        <div class="col-md-6">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description|truncatewords:10 }}</p>
        </div>
        {% endfor %}
    </div>
</div>

<!-- Bad - Inconsistent naming and formatting -->
<div>
    {% for p in products %}
    <div>
        <h5>{{ p.name }}</h5>
        <p>{{ p.desc }}</p>
    </div>
    {% endfor %}
</div>
```

### Template Naming Conventions

```
templates/
├── base/
│   └── base.html                    # Main layout
├── shop/
│   ├── home.html                   # Page-specific templates
│   ├── product_list.html
│   ├── product_detail.html
│   └── ...
└── admin/
    ├── dashboard.html
    └── ...
```

### Template Best Practices

```html
<!-- Use block names consistently -->
{% block content %}
    <!-- Page content here -->
{% endblock %}

{% block extra_js %}
    <!-- Additional scripts here -->
{% endblock %}

<!-- Use descriptive variable names -->
{% for product in products %}
    <div>{{ product.name }}</div>
{% endfor %}

<!-- Not: for p in prods -->

<!-- Use filters appropriately -->
{{ product.price|floatformat:0 }}     <!-- Good: format decimal -->
{{ order.created_at|date:"d/m/Y" }}  <!-- Good: format date -->

<!-- Use if/else for conditionals -->
{% if product.stock > 0 %}
    <span class="text-success">In Stock</span>
{% else %}
    <span class="text-danger">Out of Stock</span>
{% endif %}
```

## Naming Conventions

### Variables
```python
# Good
user_email = "user@example.com"
product_count = 10
is_available = True

# Bad
ue = "user@example.com"
cnt = 10
avail = True
```

### Functions & Methods
```python
# Good - Use verbs for functions
def get_active_products():
    pass

def filter_by_category(category):
    pass

def calculate_total_price(items):
    pass

# Bad
def products():
    pass

def category(cat):
    pass

def price(items):
    pass
```

### Classes
```python
# Good - Use nouns, PascalCase
class ProductManager:
    pass

class OrderProcessor:
    pass

# Bad
class product_mgr:
    pass

class OrderProcess:
    pass
```

## Database Query Best Practices

```python
# Good - Efficient queries
products = Product.objects.filter(
    is_active=True
).select_related('category').prefetch_related('reviews')

# Bad - N+1 query problem
products = Product.objects.all()
for product in products:
    print(product.category.name)  # Extra query for each product
    for review in product.reviews.all():  # Another extra query
        print(review.comment)
```

## Comments & Documentation

```python
# Good - Clear docstrings
def process_order(order):
    """Process an order and update inventory.
    
    Args:
        order: Order object to process
        
    Returns:
        Boolean indicating success
        
    Raises:
        OutOfStockError: If product stock insufficient
    """
    pass

# Bad - Unclear or obvious comments
def process_order(order):
    # Process order
    # Update stuff
    pass
```

## Django-Specific Best Practices

### Always Use get_object_or_404

```python
# Good
product = get_object_or_404(Product, id=product_id)

# Bad
try:
    product = Product.objects.get(id=product_id)
except Product.DoesNotExist:
    return HttpResponse('Not found', status=404)
```

### Use select_related for Foreign Keys

```python
# Good
orders = Order.objects.select_related('user')

# Bad
orders = Order.objects.all()
for order in orders:
    user = order.user  # Extra database query
```

### Use prefetch_related for Reverse Relations

```python
# Good
products = Product.objects.prefetch_related('reviews')

# Bad
products = Product.objects.all()
for product in products:
    reviews = product.reviews.all()  # Extra query per product
```

### Use Decorators for Common Tasks

```python
# Good
@login_required
def user_profile(request):
    pass

@user_passes_test(is_admin)
def admin_panel(request):
    pass

# Bad
def user_profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    pass
```

## Security Best Practices

```python
# Always use CSRF protection in forms
<form method="post">
    {% csrf_token %}
    <!-- form content -->
</form>

# Always escape user input in templates
<p>{{ comment|escape }}</p>

# Use Django's built-in password hashing
from django.contrib.auth.hashers import make_password
password_hash = make_password('plaintext_password')

# Never expose sensitive info in error messages
# Bad
except Exception as e:
    return HttpResponse(f'Error: {e}')  # Could expose passwords, credentials

# Good
except Exception as e:
    logger.error(f'Error: {e}')
    return HttpResponse('An error occurred', status=500)
```

## File Organization

### models.py
```python
# Order by relationship complexity
# 1. Models with no foreign keys
# 2. Models with foreign keys
# 3. Models with many-to-many relations

class Category(models.Model):
    pass

class Product(models.Model):
    category = models.ForeignKey(Category, ...)

class Review(models.Model):
    product = models.ForeignKey(Product, ...)
    user = models.ForeignKey(User, ...)
```

### views.py
```python
# Group related views together
# 1. Authentication views
# 2. Shop/product views  
# 3. Cart/order views
# 4. User account views
# 5. Admin views

# Authentication
def register(request):
    pass

# Shop
def product_list(request):
    pass
```

## Testing Conventions

```python
# Use clear test names
def test_product_creation_with_valid_data():
    pass

def test_product_creation_without_name_raises_error():
    pass

def test_user_can_add_product_to_cart():
    pass

# Use setUp for common test data
class ProductTestCase(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            price=10000
        )
    
    def test_product_name(self):
        self.assertEqual(self.product.name, 'Test Product')
```

## Git Commit Messages

```
# Good - Clear, descriptive
"Add product filtering by category"
"Fix cart total calculation bug"
"Update order status when shipped"
"Refactor product detail view"

# Bad - Unclear, vague
"Update code"
"Fix stuff"
"Changes"
"asdf"
```

## Code Review Checklist

- [ ] Follows PEP 8 style guide
- [ ] Functions have docstrings
- [ ] Variables have clear names
- [ ] No hardcoded values
- [ ] Error handling included
- [ ] No duplicate code
- [ ] Queries are optimized
- [ ] Security best practices followed
- [ ] Tests included
- [ ] Documentation updated

## Performance Guidelines

```python
# Use only() to limit fields
products = Product.objects.only('name', 'price')

# Use values() for list queries
product_dicts = Product.objects.values('id', 'name', 'price')

# Use count() instead of len()
count = Product.objects.count()  # Good
count = len(Product.objects.all())  # Bad - loads all objects

# Use exists() for existence checks
if Product.objects.filter(id=1).exists():  # Good
    pass
if Product.objects.filter(id=1):  # Bad - loads object
    pass
```

## Tools for Code Quality

```bash
# Format code
black snackshop/

# Check style
flake8 snackshop/

# Import sorting
isort snackshop/

# Type checking
mypy snackshop/

# Test coverage
coverage run --source='.' manage.py test
coverage report
```

## Helpful Resources

- [PEP 8 Style Guide](https://pep8.org/)
- [Django Best Practices](https://docs.djangoproject.com/en/4.2/faq/models/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django)
- [Django Design Patterns](https://www.apress.com/us/book/9781484267585)

---

**Remember**: Code is read much more often than it's written. Write code that's easy to understand!
