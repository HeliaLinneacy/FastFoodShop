@echo off
REM Quick Start Script for Django Snack Shop (Windows)

echo 🚀 Django Snack Shop - Quick Start
echo ====================================

REM Check Python installation
echo ✓ Checking Python installation...
python --version

REM Create virtual environment
echo.
echo ✓ Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo ✓ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo ✓ Installing dependencies...
pip install -r requirements.txt

REM Copy environment file
echo ✓ Setting up environment file...
if not exist ".env" (
    copy .env.example .env
    echo   ℹ️  Please update .env with your database credentials
)

REM Create migrations
echo ✓ Creating database migrations...
python manage.py makemigrations

REM Apply migrations
echo ✓ Applying migrations...
python manage.py migrate

REM Create superuser
echo.
echo ✓ Creating superuser (admin account)...
python manage.py createsuperuser

REM Load initial data
echo.
echo ✓ Loading initial data...
python manage.py populate_data

REM Run development server
echo.
echo ✅ Setup complete! Starting development server...
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:8000/
echo    Admin: http://localhost:8000/admin/
echo.
echo 📚 Default test accounts (from populate_data):
echo    Admin: admin@snackshop.com / admin123
echo    User: user@example.com / user123
echo    Test: test@example.com / test123
echo.

python manage.py runserver
