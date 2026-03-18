"""
WSGI config for Snack Shop project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'snackshop_project.settings')

application = get_wsgi_application()
