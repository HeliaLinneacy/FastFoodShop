# Snack Shop - Django & MySQL

Ứng dụng e-commerce hoàn chỉnh bán snack và thực phẩm, xây dựng bằng Django và MySQL. Cung cấp cửa hàng trực tuyến đầy đủ tính năng với xác thực người dùng, quản lý sản phẩm, giỏ hàng, xử lý đơn hàng và bảng điều khiển admin.

## Hướng Dẫn Chạy Chi Tiết (Máy Chưa Cài Gì)

### BƯỚC 0: Chuẩn Bị Trước

Trước khi bắt đầu, bạn cần cài đặt những phần mềm sau:

#### 1. Cài Python
- Truy cập: https://www.python.org/downloads/
- Download Python 3.11.9+ (phiên bản 3.12 trở xuống)
- Khi cài đặt, **ĐẦU TIÊN**: Tích chọn ✓ "Add Python to PATH"
- Click "Install Now"
- Chờ hoàn thành cài đặt
- Thử lệnh này trong PowerShell/CMD để kiểm tra:
  ```
  python --version
  ```
  Nếu hiện phiên bản Python là OK

#### 2. Cài MySQL Server
- Truy cập: https://dev.mysql.com/downloads/mysql/
- Download MySQL Community Server (phiên bản ổn định)
- Cài đặt MySQL Server
- Chọn "MySQL as a Windows Service" (để chạy tự động)
- Note lại **password root** của MySQL (ví dụ: `password123`)
- Chạy lệnh kiểm tra:
  ```
  mysql -u root -p
  ```
  Nhập password root mà bạn vừa set. Nếu vào được là OK. Gõ `exit` để thoát.

---

### BƯỚC 1: Copy Mã Nguồn

Sao chép thư mục `django_project` từ repo này đến máy của bạn (ví dụ: `D:\webdoan\django_project`).

---

### BƯỚC 2: Mở Terminal và Chuyển Đến Thư Mục Dự Án

```powershell
cd D:\webdoan\django_project
```

(Thay `D:\webdoan\django_project` bằng đường dẫn thực tế trên máy bạn)

---

### BƯỚC 3: Tạo Virtual Environment

Virtual Environment là môi trường Python riêng biệt để tránh xung đột.

```powershell
python -m venv venv
```

Chờ 1-2 phút để hoàn thành.

---

### BƯỚC 4: Kích Hoạt Virtual Environment

**Windows:**
```powershell
venv\Scripts\activate
```

Nếu thành công, bạn sẽ thấy `(venv)` ở đầu dòng lệnh.

---

### BƯỚC 5: Cập Nhật pip

```powershell
python -m pip install --upgrade pip
```

---

### BƯỚC 6: Cài Đặt Các Package Cần Thiết

```powershell
pip install -r requirements.txt
```

Chờ quá trình cài đặt hoàn thành (khoảng 2-5 phút).

---

### BƯỚC 7: Cấu Hình Database (MySQL)

#### Tạo Database trong MySQL:

Mở PowerShell/CMD và chạy:

```powershell
mysql -u root -p
```

Nhập password root của MySQL.

Sau đó, gõ các lệnh sau (từng lệnh một):

```sql
CREATE DATABASE snackshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Tạo file `.env`:

Khi còn ở thư mục `django_project`, tạo file ``.env`` với nội dung:

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

**Lưu ý:** Thay `password123` bằng **password root MySQL của bạn** (password bạn set khi cài MySQL).

---

### BƯỚC 8: Chạy Migrations (Tạo Bảng Database)

```powershell
python manage.py migrate
```

Chờ hoàn thành. Bạn sẽ thấy nhiều dòng "OK".

---

### BƯỚC 9: Tạo Tài Khoản Admin

```powershell
python manage.py createsuperuser
```

Hệ thống sẽ hỏi:
- **Email:** `admin@snackshop.com`
- **Password:** `admin123` (gõ 2 lần)

---

### BƯỚC 10: Load Dữ Liệu Mẫu (Sản Phẩm, Danh Mục, v.v.)

```powershell
python manage.py populate_data
```

Đợi cho tới khi thấy dòng `✓ Database population completed successfully!`

---

### BƯỚC 11: Chạy Server

python manage.py runserver
```

Bạn sẽ thấy dòng:
```
Starting development server at http://127.0.0.1:8000/
```

---

### BƯỚC 12: Truy Cập Ứng Dụng

Mở trình duyệt (Chrome, Firefox, Edge, v.v.) và truy cập:

#### Trang Chủ (Khách Hàng)
- **URL:** http://localhost:8000/
- Xem sản phẩm, danh mục, giỏ hàng

#### Admin Panel (Quản Trị)
- **URL:** http://localhost:8000/admin/
- **Email:** `admin@snackshop.com`
- **Password:** `admin123`
- Quản lý sản phẩm, đơn hàng, người dùng, danh mục

---

## Hướng Dẫn Tính Năng Chính

### Cho Khách Hàng

1. **Duyệt Sản Phẩm**
   - Vào trang chủ: http://localhost:8000/
   - Click vào các danh mục (Snack mặn, Kẹo & Chocolate, v.v.)
   - Hoặc truy cập trực tiếp: http://localhost:8000/products/

2. **Xem Chi Tiết Sản Phẩm**
   - Click vào sản phẩm bất kỳ
   - Xem giá, mô tả, rating, bình luận

3. **Mua Hàng (Sau Khi Đăng Nhập)**
   - Đăng ký tài khoản: http://localhost:8000/register/
   - Đăng nhập: http://localhost:8000/login/
   - Thêm sản phẩm vào giỏ: http://localhost:8000/cart/
   - Thanh toán: http://localhost:8000/checkout/
   - Xem đơn hàng: http://localhost:8000/orders/

4. **Quản Lý Hồ Sơ**
   - Truy cập: http://localhost:8000/profile/
   - Cập nhật thông tin cá nhân

### Cho Quản Trị Viên

1. **Bảng Điều Khiển**
   - Vào Admin: http://localhost:8000/admin/
   - Xem thống kê, doanh số bán hàng

2. **Quản Lý Sản Phẩm**
   - Admin > Sản Phẩm
   - Thêm/Sửa/Xóa sản phẩm
   - Quản lý kho hàng

3. **Quản Lý Đơn Hàng**
   - Admin > Đơn Hàng
   - Xem và cập nhật trạng thái đơn hàng

4. **Quản Lý Người Dùng**
   - Admin > Người Dùng
   - Tạo/Sửa/Xóa tài khoản người dùng

5. **Quản Lý Danh Mục**
   - Admin > Danh Mục
   - Thêm danh mục sản phẩm mới

---

## Khắc Phục Sự Cố Thường Gặp

### Lỗi 1: Python không được tìm thấy
**Vấn đề:** Gõ `python` nhưng báo lỗi "python is not recognized"

**Giải pháp:**
- Cài lại Python và **ĐẦU TIÊN** tích chọn ✓ "Add Python to PATH"
- Hoặc dùng `python3` thay vì `python`
- Thử restart PowerShell/CMD sau khi cài Python

### Lỗi 2: pip install bị lỗi
**Vấn đề:** Khi chạy `pip install -r requirements.txt` bị lỗi

**Giải pháp:**
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### Lỗi 3: MySQL không chạy được
**Vấn đề:** Lỗi "Can't connect to MySQL server"

**Giải pháp:**
- Kiểm tra MySQL có chạy: Mở Services (services.msc) tìm MySQL
- Nếu không chạy, click Start
- Hoặc khởi động lại máy

### Lỗi 4: Database password sai
**Vấn đề:** Lỗi "Access denied for user 'root'"

**Giải pháp:**
- Kiểm tra password trong file `.env` có đúng không
- Nếu quên password, cần reset:
  - Dừng MySQL Service
  - Mở MySQL Command Line Client (với mode admin)
  - Gõ: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';`
  - Update lại `.env` với password mới

### Lỗi 5: Port 8000 đã được sử dụng
**Vấn đề:** Lỗi "Address already in use"

**Giải pháp:**
- Dừng server đã chạy (Ctrl + C)
- Hoặc chạy port khác:
  ```powershell
  python manage.py runserver 8001
  ```
  (Rồi truy cập http://localhost:8001/)

### Lỗi 6: Migrations chưa chạy
**Vấn đề:** Bảng trong CSDL chưa được tạo

**Giải pháp:**
```powershell
python manage.py makemigrations snackshop
python manage.py migrate
```

### Lỗi 7: Quên tài khoản admin
**Vấn đề:** Không nhớ password admin

**Giải pháp:**
```powershell
python manage.py shell
```

Rồi gõ:
```python
from snackshop.models import CustomUser
admin = CustomUser.objects.filter(email='admin@snackshop.com').first()
if admin:
    admin.delete()
    print("Deleted old admin")
exit()
```

Sau đó tạo admin mới:
```powershell
python manage.py createsuperuser
```

### Lỗi 8: Không thấy sản phẩm trong danh mục
**Vấn đề:** Load dữ liệu nhưng sản phẩm không hiển thị

**Giải pháp:**
```powershell
python manage.py shell
```

Gõ:
```python
from snackshop.models import Product
Product.objects.all().update(is_active=True)
exit()
```

Rồi refresh browser.

### Lỗi 9: Virtual environment không kích hoạt
**Vấn đề:** Gõ `venv\Scripts\activate` nhưng không thấy `(venv)`

**Giải pháp:**
- Kiểm tra đang ở thư mục `django_project` chưa
- Thử lệnh:
  ```powershell
  .\venv\Scripts\activate
  ```
  (Thêm dấu `.` ở đầu)

### Lỗi 10: Hình ảnh sản phẩm không hiển thị
**Vấn đề:** Sản phẩm có mô tả nhưng không có hình ảnh

**Giải pháp:**
- Kiểm tra URL hình ảnh có hợp lệ
- Thử reload browser (Ctrl + F5)
- Kiểm tra internet có kết nối tốt không

---

## Thông Tin Hữu Ích

### Cấu Trúc Thư Mục Dự Án

```
django_project/
├── manage.py                    # Lệnh quản lý Django
├── requirements.txt             # Danh sách package cần cài
├── .env                         # Biến môi trường (tạo từ .env.example)
├── .env.example                 # Mẫu biến môi trường
├── logs/                        # Thư mục log
├── snackshop_project/           # Cấu hình chính Django
│   ├── settings.py              # Cài đặt Django
│   ├── urls.py                  # Định tuyến URL chính
│   ├── wsgi.py                  # Cấu hình server
│   └── asgi.py                  # Cấu hình server async
└── snackshop/                   # Ứng dụng chính
    ├── models.py                # Mô hình dữ liệu
    ├── views.py                 # Logic xử lý
    ├── urls.py                  # Định tuyến app
    ├── forms.py                 # Form HTML
    ├── admin.py                 # Cấu hình admin panel
    ├── templates/               # HTML templates
    │   ├── base/                # Base layout
    │   ├── shop/                # Trang khách hàng
    │   └── admin/               # Trang quản trị
    ├── migrations/              # Lịch sử thay đổi DB
    └── management/
        └── commands/
            └── populate_data.py # Load dữ liệu mẫu
```

### Các Lệnh Django Thường Dùng

| Lệnh | Mục đích |
|------|---------|
| `python manage.py migrate` | Áp dụng migration vào DB |
| `python manage.py makemigrations` | Tạo file migration từ models |
| `python manage.py createsuperuser` | Tạo tài khoản admin |
| `python manage.py populate_data` | Load dữ liệu mẫu |
| `python manage.py runserver` | Chạy server phát triển |
| `python manage.py shell` | Vào Python shell với Django context |
| `python manage.py test` | Chạy các bài kiểm tra |

### Các URL Thường Dùng

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

## Hỗ Trợ Thêm

Nếu gặp bất kỳ vấn đề nào:

1. Kiểm tra lại từng bước hướng dẫn
2. Xem phần "Khắc Phục Sự Cố" ở trên
3. Đảm bảo Python, MySQL, pip đã cài đúng
4. Kiểm tra file `.env` có cấu hình đúng không

**Chúc bạn thành công! 🎉**

## Support & Documentation

For more information on Django:
- [Django Documentation](https://docs.djangoproject.com/)
- [Django Models](https://docs.djangoproject.com/en/4.2/topics/db/models/)
- [Django Views](https://docs.djangoproject.com/en/4.2/topics/http/views/)

For MySQL:
- [MySQL Documentation](https://dev.mysql.com/doc/)

## License

This project is part of a portfolio and is available for educational purposes.

## Notes

- This is a server-side rendered application using Django templates
- The application uses Bootstrap 5 for responsive UI
- All data is stored in MySQL database
- Admin panel is powered by Django's built-in admin interface
- Security features are configured but should be enhanced for production

---

**Version**: 1.0.0  
**Last Updated**: March 2024
