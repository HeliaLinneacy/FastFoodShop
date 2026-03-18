from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm
from django.core.exceptions import ValidationError
from .models import CustomUser, Review, Category, Product, Order


class CustomUserCreationForm(UserCreationForm):
    """Form for user registration."""
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=150, required=True)
    last_name = forms.CharField(max_length=150, required=True)
    phone = forms.CharField(max_length=20, required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)
    
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'phone', 'address', 'password1', 'password2')
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError('This email is already registered.')
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = user.email  # Set username to email
        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    """Form for user profile edit."""
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'phone', 'address', 'avatar')


class CustomAuthenticationForm(AuthenticationForm):
    """Form for user login."""
    username = forms.EmailField(label='Email', widget=forms.EmailInput())
    
    class Meta:
        model = CustomUser
        fields = ('username', 'password')


class ReviewForm(forms.ModelForm):
    """Form for product review."""
    rating = forms.IntegerField(
        min_value=1,
        max_value=5,
        widget=forms.HiddenInput(),
        label='Đánh giá'
    )
    comment = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 4,
            'class': 'form-control',
            'placeholder': 'Viết nhận xét của bạn về sản phẩm...'
        }),
        label='Nhận xét',
        max_length=500
    )
    
    class Meta:
        model = Review
        fields = ('rating', 'comment')
    
    def clean_rating(self):
        rating = self.cleaned_data.get('rating')
        if not rating or rating == '0':
            raise forms.ValidationError('Vui lòng chọn số sao để đánh giá.')
        return rating


class CategoryForm(forms.ModelForm):
    """Form for category management."""
    class Meta:
        model = Category
        fields = ('name', 'description', 'image', 'slug')


class ProductForm(forms.ModelForm):
    """Form for product management."""
    class Meta:
        model = Product
        fields = ('name', 'description', 'price', 'category', 'image', 'stock', 'is_active')


class OrderForm(forms.ModelForm):
    """Form for order checkout."""
    payment_method = forms.ChoiceField(
        choices=[('cod', 'Thanh toán khi nhận hàng'), ('online', 'Thanh toán trực tuyến')],
        widget=forms.RadioSelect,
        label='Phương thức thanh toán',
        initial='cod',
    )

    class Meta:
        model = Order
        fields = ('customer_name', 'customer_email', 'customer_phone', 'customer_address', 'note', 'payment_method')
        widgets = {
            'customer_name': forms.TextInput(attrs={'class': 'form-control'}),
            'customer_email': forms.EmailInput(attrs={'class': 'form-control'}),
            'customer_phone': forms.TextInput(attrs={'class': 'form-control'}),
            'customer_address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'note': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
        }
