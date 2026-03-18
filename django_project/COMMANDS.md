# 🎯 Quick Commands Reference

## Setup & Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database credentials
```

## Database & Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Load sample data
python manage.py populate_data

# Reset database (dangerous!)
python manage.py flush
```

## Development Server

```bash
# Run development server
python manage.py runserver

# Run on different port
python manage.py runserver 8001

# Run with verbose output
python manage.py runserver --verbose
```

## Admin & Management

```bash
# Access Django admin panel
# http://localhost:8000/admin/

# Change admin password
python manage.py changepassword admin

# Create new admin
python manage.py createsuperuser

# Delete data
python manage.py flush
```

## Static Files

```bash
# Collect static files (production)
python manage.py collectstatic

# Clear static files
python manage.py collectstatic --clear
```

## Testing

```bash
# Run all tests
python manage.py test

# Run specific test
python manage.py test snackshop.tests.ProductTest

# Run with verbose output
python manage.py test --verbose
```

## Debugging

```bash
# Django shell
python manage.py shell

# Execute Python in Django context
python manage.py shell < script.py

# Show SQL queries
python manage.py sqlmigrate snackshop 0001
```

## Database Operations

```bash
# Backup database (MySQL)
mysqldump -u root -p snackshop > backup.sql

# Restore database
mysql -u root -p snackshop < backup.sql

# MySQL command line
mysql -u root -p snackshop
```

## Production Deployment

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn snackshop_project.wsgi

# Run migrations on server
python manage.py migrate --noinput

# Create superuser non-interactively
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'password')
END
```

## Useful URLs

- Home: `http://localhost:8000/`
- Products: `http://localhost:8000/products/`
- Cart: `http://localhost:8000/cart/`
- Orders: `http://localhost:8000/orders/`
- Admin: `http://localhost:8000/admin/`
- Admin Products: `http://localhost:8000/admin/snackshop/product/`
- Admin Orders: `http://localhost:8000/admin/snackshop/order/`

## Environment Variables (.env)

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.mysql
DB_NAME=snackshop
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## Troubleshooting

### Port Already in Use
```bash
# Use different port
python manage.py runserver 8001
```

### Database Connection Error
```bash
# Check MySQL is running
# Windows: net start MySQL80
# macOS: brew services start mysql
# Linux: sudo service mysql start
```

### Missing Migration
```bash
python manage.py migrate
```

### Static Files Not Loading
```bash
python manage.py collectstatic
```

### Can't Login as Admin
```bash
python manage.py changepassword admin
```

## File Structure

```
django_project/
├── snackshop/              # Main application
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   ├── urls.py             # URL patterns
│   ├── forms.py            # Form classes
│   ├── admin.py            # Admin configuration
│   ├── templates/          # HTML templates
│   ├── static/             # CSS, JS files
│   └── migrations/         # Database migrations
├── snackshop_project/      # Project settings
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL config
│   └── wsgi.py             # WSGI config
├── manage.py               # Management script
├── requirements.txt        # Dependencies
└── .env                    # Environment variables
```

## Key Files to Edit

- `snackshop_project/settings.py` - Django configuration
- `snackshop/models.py` - Database models
- `snackshop/views.py` - Business logic
- `snackshop/urls.py` - URL routing
- `snackshop/templates/` - HTML templates
- `.env` - Environment variables

## Tips

✅ Always use virtual environment
✅ Keep `.env` file in `.gitignore`
✅ Run migrations after model changes
✅ Test before deployment
✅ Use Django admin panel for quick data changes
✅ Check logs for errors
✅ Use `select_related()` and `prefetch_related()` for performance

---

For more help: `python manage.py help`
