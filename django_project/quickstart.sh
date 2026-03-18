#!/bin/bash
# Quick Start Script for Django Snack Shop

echo "🚀 Django Snack Shop - Quick Start"
echo "===================================="

# Check Python installation
echo "✓ Checking Python installation..."
python --version

# Create virtual environment
echo ""
echo "✓ Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "✓ Activating virtual environment..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    # For Windows
    call venv\Scripts\activate.bat
fi

# Install dependencies
echo "✓ Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
echo "✓ Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  ℹ️  Please update .env with your database credentials"
fi

# Create migrations
echo "✓ Creating database migrations..."
python manage.py makemigrations

# Apply migrations
echo "✓ Applying migrations..."
python manage.py migrate

# Create superuser
echo ""
echo "✓ Creating superuser (admin account)..."
python manage.py createsuperuser

# Load initial data
echo ""
echo "✓ Loading initial data..."
python manage.py populate_data

# Run development server
echo ""
echo "✅ Setup complete! Starting development server..."
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:8000/"
echo "   Admin: http://localhost:8000/admin/"
echo ""
echo "📚 Default test accounts (from populate_data):"
echo "   Admin: admin@snackshop.com / admin123"
echo "   User: user@example.com / user123"
echo "   Test: test@example.com / test123"
echo ""

python manage.py runserver
