import os
import sys

# Thêm thư mục django_project vào Python path
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'django_project'))
if path not in sys.path:
    sys.path.append(path)

from snackshop_project.wsgi import app
