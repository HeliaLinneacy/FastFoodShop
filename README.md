
# Snack Shop - Ứng Dụng Bán Hàng Online (Django + MySQL)

Ứng dụng e-commerce hoàn chỉnh bán snack và thực phẩm, xây dựng bằng Django 4.2 và MySQL. Cung cấp cửa hàng trực tuyến đầy đủ tính năng với xác thực người dùng, quản lý sản phẩm, giỏ hàng, xử lý đơn hàng và bảng điều khiển admin.

---

## Hướng Dẫn Chạy Chi Tiết 

### BƯỚC 0: Chuẩn Bị Trước

Trước khi bắt đầu, bạn cần cài đặt những phần mềm sau:

#### 1️⃣ Cài Python 3.10+

1. Truy cập: https://www.python.org/downloads/
2. Download **Python 3.10 trở lên** (phiên bản mới nhất)
3. Chạy file tải về
4. **QUAN TRỌNG:** Tích chọn ✓ "Add Python to PATH" **ĐẦU TIÊN RỒI** Click "Install Now"
5. Chờ hoàn thành cài đặt
6. Mở PowerShell/CMD và kiểm tra:
   ```
   python --version
   ```
   Nếu hiện phiên bản Python (ví dụ: Python 3.14.2) là OK 

#### 2️⃣ Cài MySQL Server 8.0+

1. Truy cập: https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server** (phiên bản ổn định, không cần SQL Workbench)
3. Chạy installer và làm theo hướng dẫn:
   - Chọn "MySQL Server"
   - Chọn "MySQL as a Windows Service" (để chạy tự động khi khởi động PC)
   - Khi hỏi port, dùng mặc định **3306**
   - **Khi hỏi password Root**, nhập password dễ nhớ (ví dụ: `password123`)
   - **GHI NHỚ** password này, sẽ dùng sau
4. Chợ cài xong
5. Mở PowerShell/CMD và kiểm tra:
   ```
   mysql -u root -p
   ```
   Nhập password root vừa set. Nếu vào được dòng `mysql>` là OK . Gõ `exit` để thoát.

---

### BƯỚC 1: Copy Mã Nguồn

Sao chép thư mục **django_project** nằm trong folder này về máy của bạn.

Ví dụ: `D:\webdoan\django_project`

---

### BƯỚC 2: Mở Terminal và Chuyển Đến Thư Mục Dự Án

Mở **PowerShell** hoặc **Command Prompt** và gõ:

```powershell
cd D:\webdoan\django_project
```

(Thay `D:\webdoan\django_project` bằng đường dẫn thực tế trên máy bạn)

---

### BƯỚC 3: Tạo Virtual Environment

Virtual Environment là môi trường Python riêng biệt để tránh xung đột package.

```powershell
python -m venv venv
```

**Chờ 1-2 phút** để hoàn thành. Bạn sẽ thấy thư mục `venv` được tạo.

---

### BƯỚC 4: Kích Hoạt Virtual Environment

```powershell
venv\Scripts\activate
```

✅ **Nếu thành công**, bạn sẽ thấy `(venv)` ở đầu dòng lệnh, ví dụ:
```
(venv) PS D:\webdoan\django_project>
```

---

### BƯỚC 5: Cập Nhật pip (Package Manager)

```powershell
python -m pip install --upgrade pip
```

Chờ hoàn thành.

---

### BƯỚC 6: Cài Đặt Các Package Cần Thiết

```powershell
pip install -r requirements.txt
```

**Chờ 2-5 phút** cho quá trình cài đặt. Bạn sẽ thấy nhiều dòng "Successfully installed...".

Nếu lỗi, thử lệnh này:
```powershell
pip install -r requirements.txt --no-cache-dir
```

---

### BƯỚC 7: Tạo Database trong MySQL

Mở PowerShell/CMD (vẫn ở thư mục `django_project`) và gõ:

```powershell
mysql -u root -p
```

**Nhập password root** mà bạn set khi cài MySQL.

Bạn sẽ vào dòng `mysql>`. Gõ lệnh này:

```sql
CREATE DATABASE snackshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Rồi gõ `exit` để thoát.

---

### BƯỚC 8: Tạo File `.env`

Trong thư mục `django_project`, tạo một file text mới tên là `.env` (không có tên, chỉ có đuôi `.env`).

Mở file `.env` bằng VSCode hoặc Notepad và **copy-paste nội dung này**:

```
DEBUG=True
SECRET_KEY=django-insecure-snackshop-secret-key-change-in-production

DB_ENGINE=django.db.backends.mysql
DB_NAME=snackshop
DB_USER=root
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=3306

ALLOWED_HOSTS=localhost,127.0.0.1

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**QUAN TRỌNG:** Thay `password123` bằng **password root MySQL của bạn** (password bạn set ở Bước 2).

Lưu file (Ctrl + S).

---

### BƯỚC 9: Chạy Database Migrations

Migrations là những file tự động tạo bảng trong database dựa trên models.

```powershell
python manage.py migrate
```

Chờ hoàn thành. Bạn sẽ thấy nhiều dòng "OK" cuối cùng là:
```
Running migrations:
  Applying auth.0001_initial... OK
  ...
  Applying sessions.0001_initial... OK
```

---

### BƯỚC 10: Tạo Tài Khoản Admin

```powershell
python manage.py createsuperuser
```

Hệ thống sẽ hỏi:
- **Email address:** Gõ `admin@snackshop.com`
- **Password:** Gõ `admin123`
- **Password (again):** Gõ lại `admin123`

Kết thúc bằng:
```
Superuser created successfully.
```

---

### BƯỚC 11: Load Dữ Liệu Mẫu (60 Sản Phẩm, 6 Danh Mục)

```powershell
python manage.py populate_data
```

Chờ tới khi thấy dòng:
```
✓ Database population completed successfully!
```

Dữ liệu đã load: 
- 6 danh mục (Snack mặn, Kẹo & Chocolate, Bánh quy, Hạt dinh dưỡng, Bắp rang, Đồ uống)
- 56 sản phẩm (10 sản phẩm mỗi danh mục)
- Hình ảnh từ Unsplash cho mỗi sản phẩm

---

### BƯỚC 12: Chạy Development Server

```powershell
python manage.py runserver
```

✅ **Nếu thành công**, bạn sẽ thấy:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

### BƯỚC 13: Truy Cập Ứng Dụng

Mở trình duyệt **Chrome**, **Firefox**, **Edge** hoặc **Safari** và truy cập:

#### 🏠 Trang Chủ (Khách Hàng)
```
http://localhost:8000/
```

#### 🔐 Admin Panel (Quản Trị)
```
http://localhost:8000/admin/
```

Đăng nhập với:
- **Email:** `admin@snackshop.com`
- **Password:** `admin123`

---

## 🆘 Khắc Phục Sự Cố Thường Gặp

### ❌ Lỗi: "python is not recognized"
- Cài lại Python và tích ✓ "Add Python to PATH"
- Đóng và mở lại PowerShell/CMD

### ❌ Lỗi: "Access denied for user 'root'"
- Kiểm tra password MySQL trong `.env` có đúng không
- Password phải là password root bạn set khi cài MySQL

### ❌ Lỗi: "Port 8000 already in use"
```powershell
python manage.py runserver 8001
```
Rồi truy cập http://localhost:8001/

### ❌ Không thấy `(venv)` ở dầu terminal
Thử lệnh này để kích hoạt lại:
```powershell
.\venv\Scripts\activate
```

### ❌ Không thấy sản phẩm khi click danh mục
Dừng server (Ctrl + C), rồi chạy:
```powershell
python manage.py shell
```

Gõ:
```python
from snackshop.models import Product
Product.objects.all().update(is_active=True)
exit()
```

Chạy lại server rồi refresh browser (Ctrl + F5).

---

## 📚 Các Lệnh Django Thường Dùng

```powershell
python manage.py migrate              # Tạo bảng database
python manage.py createsuperuser      # Tạo tài khoản admin
python manage.py populate_data        # Load dữ liệu mẫu
python manage.py runserver            # Chạy server
python manage.py shell                # Vào Python shell
```

---

## 🌐 Các URL Chính

| URL | Mục đích |
|-----|---------|
| http://localhost:8000/ | Trang chủ |
| http://localhost:8000/products/ | Danh sách sản phẩm |
| http://localhost:8000/cart/ | Giỏ hàng |
| http://localhost:8000/checkout/ | Thanh toán |
| http://localhost:8000/orders/ | Lịch sử đơn hàng |
| http://localhost:8000/admin/ | Admin panel |
| http://localhost:8000/login/ | Đăng nhập |
| http://localhost:8000/register/ | Đăng ký |
http://127.0.0.1:8000/admin/  | Admin
---
  