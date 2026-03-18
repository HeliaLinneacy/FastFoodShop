from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from snackshop.models import Category, Product, Cart

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with initial data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate database...'))
        
        # Create admin user
        if not User.objects.filter(email='admin@snackshop.com').exists():
            admin = User.objects.create_superuser(
                username='admin@snackshop.com',
                email='admin@snackshop.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                phone='0901234567',
                address='123 Admin Street, Ho Chi Minh City',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Created admin user: {admin.email}'))
        else:
            self.stdout.write(self.style.WARNING('✗ Admin user already exists'))
        
        # Create regular users
        users_data = [
            {
                'email': 'user@example.com',
                'password': 'user123',
                'first_name': 'Nguyễn',
                'last_name': 'Văn A',
                'phone': '0912345678',
                'address': '456 User Street, Ho Chi Minh City',
            },
            {
                'email': 'test@example.com',
                'password': 'test123',
                'first_name': 'Trần',
                'last_name': 'Thị B',
                'phone': '0923456789',
                'address': '789 Test Street, Hanoi',
            },
        ]
        
        for user_data in users_data:
            if not User.objects.filter(email=user_data['email']).exists():
                user = User.objects.create_user(
                    username=user_data['email'],
                    **user_data
                )
                # Create cart for user
                Cart.objects.get_or_create(user=user)
                self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user.email}'))
            else:
                self.stdout.write(self.style.WARNING(f'✗ User already exists: {user_data["email"]}'))
        
        # Create categories
        categories_data = [
            {
                'name': 'Snack mặn',
                'description': 'Các loại snack mặn như khoai tây chiên, snack que',
                'slug': 'snack-man',
            },
            {
                'name': 'Kẹo & Chocolate',
                'description': 'Kẹo các loại, socola ngọt ngào',
                'slug': 'keo-chocolate',
            },
            {
                'name': 'Bánh quy',
                'description': 'Bánh quy, bánh cookies các loại',
                'slug': 'banh-quy',
            },
            {
                'name': 'Hạt dinh dưỡng',
                'description': 'Các loại hạt rang, sấy khô bổ dưỡng',
                'slug': 'hat-dinh-duong',
            },
            {
                'name': 'Bắp rang',
                'description': 'Bắp rang bơ, bắp caramel',
                'slug': 'bap-rang',
            },
            {
                'name': 'Đồ uống',
                'description': 'Nước ngọt, trà, cà phê, nước ép các loại',
                'slug': 'do-uong',
            },
        ]
        
        for cat_data in categories_data:
            if not Category.objects.filter(slug=cat_data['slug']).exists():
                category = Category.objects.create(**cat_data)
                self.stdout.write(self.style.SUCCESS(f'✓ Created category: {category.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'✗ Category already exists: {cat_data["name"]}'))
        
        # Create products
        products_data = [
            # Snack mặn (10 items)
            {
                'name': 'Khoai tây chiên Lay\'s vị tự nhiên',
                'description': 'Khoai tây chiên giòn tan, vị tự nhiên thơm ngon, đóng gói 52g tiện lợi',
                'price': 15000,
                'category_slug': 'snack-man',
                'stock': 150,
                'sold': 245,
                'rating': 4.5,
                'review_count': 89,
                'image': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd84e53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Snack que phô mai',
                'description': 'Que snack vị phô mai béo ngậy, giòn rụm',
                'price': 12000,
                'category_slug': 'snack-man',
                'stock': 120,
                'sold': 180,
                'rating': 4.3,
                'review_count': 60,
                'image': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bim bim nếp chua cay',
                'description': 'Bánh gạo nếp vị chua cay, ăn là ghiền',
                'price': 14000,
                'category_slug': 'snack-man',
                'stock': 100,
                'sold': 200,
                'rating': 4.6,
                'review_count': 95,
                'image': 'https://images.unsplash.com/photo-1585434967292-91e4ab75dd1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh tôm cuốn',
                'description': 'Bánh tôm cuốn ngoài giòn, trong bùi, vị tôm sạch',
                'price': 18000,
                'category_slug': 'snack-man',
                'stock': 80,
                'sold': 150,
                'rating': 4.7,
                'review_count': 110,
                'image': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd84e53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Cơm cháy tôm cua',
                'description': 'Cơm cháy vị tôm cua, mthơm lừng, giòn rụm',
                'price': 16000,
                'category_slug': 'snack-man',
                'stock': 110,
                'sold': 210,
                'rating': 4.4,
                'review_count': 85,
                'image': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Đậu phộng muối rang',
                'description': 'Đậu phộng rang bơ, vị mặn cay, giàu protein',
                'price': 22000,
                'category_slug': 'snack-man',
                'stock': 90,
                'sold': 170,
                'rating': 4.5,
                'review_count': 75,
                'image': 'https://images.unsplash.com/photo-1585075146064-cd4628902246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Khoai lang nướng vị mặn',
                'description': 'Khoai lang nướng, giòn ngoài bùi trong, vị mặn mặn',
                'price': 13000,
                'category_slug': 'snack-man',
                'stock': 95,
                'sold': 160,
                'rating': 4.2,
                'review_count': 70,
                'image': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Notto vị mặn',
                'description': 'Rong biển nướng vị mặn, giàu canxi và iod',
                'price': 20000,
                'category_slug': 'snack-man',
                'stock': 70,
                'sold': 140,
                'rating': 4.3,
                'review_count': 65,
                'image': 'https://images.unsplash.com/photo-1585518419759-66b616f14aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Giòi nước hoa',
                'description': 'Giòi lạc nước hoa, vị lạ lùng, hút khách',
                'price': 25000,
                'category_slug': 'snack-man',
                'stock': 60,
                'sold': 130,
                'rating': 4.6,
                'review_count': 92,
                'image': 'https://images.unsplash.com/photo-1599599810991-42fe97b43b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Snack cốc tôm',
                'description': 'Tôm sấy giòn, khô, cốc quế ngon miệng',
                'price': 30000,
                'category_slug': 'snack-man',
                'stock': 50,
                'sold': 120,
                'rating': 4.7,
                'review_count': 105,
                'image': 'https://images.unsplash.com/photo-1585238341710-4dd0cb08d5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            # Kẹo & Chocolate (10 items)
            {
                'name': 'Kẹo Lollipop Chupa Chups',
                'description': 'Kẹo mút xinh xắn, vị đa dạng, an toàn cho trẻ em',
                'price': 5000,
                'category_slug': 'keo-chocolate',
                'stock': 300,
                'sold': 500,
                'rating': 4.0,
                'review_count': 120,
                'image': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd84e53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Socola Lindt truffles',
                'description': 'Socola nhân kem mềm mịn, hương vị tinh tế ',
                'price': 45000,
                'category_slug': 'keo-chocolate',
                'stock': 80,
                'sold': 280,
                'rating': 4.8,
                'review_count': 180,
                'image': 'https://images.unsplash.com/photo-1599599810775-f9fc03eab780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Kẹo dẻo gấu Haribo',
                'description': 'Kẹo dẻo hình gấu, vị trái cây, yêu thích của bé',
                'price': 20000,
                'category_slug': 'keo-chocolate',
                'stock': 150,
                'sold': 400,
                'rating': 4.5,
                'review_count': 140,
                'image': 'https://images.unsplash.com/photo-1599599810994-b5e1b8a7d6b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Socola M&M\'s',
                'description': 'Socola vỏ đồng dân có chữ khác nhau, vui vẻ',
                'price': 35000,
                'category_slug': 'keo-chocolate',
                'stock': 120,
                'sold': 320,
                'rating': 4.4,
                'review_count': 160,
                'image': 'https://images.unsplash.com/photo-1599599810996-7c8c0e2b5a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Kẹo caramel Werther\'s',
                'description': 'Kẹo caramel vị bơ thơm lừng, ăn là ghiền',
                'price': 28000,
                'category_slug': 'keo-chocolate',
                'stock': 100,
                'sold': 250,
                'rating': 4.6,
                'review_count': 130,
                'image': 'https://images.unsplash.com/photo-1599599810998-8e9e8e9e9e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Socola đen Godiva',
                'description': 'Socola đen cao cấp, vị đắng đặc trưng, sang trọng',
                'price': 55000,
                'category_slug': 'keo-chocolate',
                'stock': 60,
                'sold': 150,
                'rating': 4.7,
                'review_count': 100,
                'image': 'https://images.unsplash.com/photo-1599600075-2e919ea41181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Kẹo bút Smarties',
                'description': 'Kẹo dạng bút, vị sữa, màu sắc bắt mắt',
                'price': 8000,
                'category_slug': 'keo-chocolate',
                'stock': 200,
                'sold': 480,
                'rating': 4.2,
                'review_count': 110,
                'image': 'https://images.unsplash.com/photo-1599599811035-8dd0cd53a47a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Kẹo mút Dum Dums',
                'description': 'Kẹo mút giá rẻ, vị đa dạng thú vị',
                'price': 3000,
                'category_slug': 'keo-chocolate',
                'stock': 400,
                'sold': 800,
                'rating': 4.0,
                'review_count': 200,
                'image': 'https://images.unsplash.com/photo-1599599813037-4b3dcd5c0b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Kẹo nougat Milky Bar',
                'description': 'Kẹo nougat vị sữa tinh khiết, ngọt ngào',
                'price': 15000,
                'category_slug': 'keo-chocolate',
                'stock': 140,
                'sold': 310,
                'rating': 4.5,
                'review_count': 125,
                'image': 'https://images.unsplash.com/photo-1599599813039-5c0b3e0b3c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            # Bánh quy (10 items)
            {
                'name': 'Bánh quy bơ Oreo',
                'description': 'Bánh quy vị socola đen thơm ngon, dễ bị quên',
                'price': 25000,
                'category_slug': 'banh-quy',
                'stock': 80,
                'sold': 320,
                'rating': 4.7,
                'review_count': 200,
                'image': 'https://images.unsplash.com/photo-1599599814287-f0c49a2e9b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy socola chip',
                'description': 'Bánh quy bơ thơm có sôcôla chip, giòn rụm',
                'price': 18000,
                'category_slug': 'banh-quy',
                'stock': 120,
                'sold': 280,
                'rating': 4.5,
                'review_count': 150,
                'image': 'https://images.unsplash.com/photo-1599599815289-f1e2662f4c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy bơ khen Danisa',
                'description': 'Bánh quy Đan Mạch, vị bơ thơm, tan trong miệng',
                'price': 35000,
                'category_slug': 'banh-quy',
                'stock': 100,
                'sold': 220,
                'rating': 4.6,
                'review_count': 170,
                'image': 'https://images.unsplash.com/photo-1599599815291-f2ee6b0b0c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy dâu tây Bepco',
                'description': 'Bánh quy dẫu tây mềm, ngọt thanh, hương dâu tây tự nhiên',
                'price': 22000,
                'category_slug': 'banh-quy',
                'stock': 110,
                'sold': 200,
                'rating': 4.4,
                'review_count': 130,
                'image': 'https://images.unsplash.com/photo-1599599815293-f2ee6b0b0c70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy vị cà phê',
                'description': 'Bánh quy cà phê đắng nhẹ, hương thơm nồng nàn',
                'price': 20000,
                'category_slug': 'banh-quy',
                'stock': 95,
                'sold': 180,
                'rating': 4.3,
                'review_count': 105,
                'image': 'https://images.unsplash.com/photo-1599599815295-f2ee6b0b0c80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy Lotus thảo dược',
                'description': 'Bánh quy kem ớt, vị đặc biệt, độc đáo',
                'price': 30000,
                'category_slug': 'banh-quy',
                'stock': 80,
                'sold': 160,
                'rating': 4.5,
                'review_count': 115,
                'image': 'https://images.unsplash.com/photo-1599599815297-f2ee6b0b0c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy bơ nước cốt chanh',
                'description': 'Bánh quy vị chanh bơ, mát lạnh, ngon miệng',
                'price': 19000,
                'category_slug': 'banh-quy',
                'stock': 105,
                'sold': 190,
                'rating': 4.4,
                'review_count': 120,
                'image': 'https://images.unsplash.com/photo-1599599815299-f2ee6b0b0c100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy ngũ cốc',
                'description': 'Bánh quy ngũ cốc bổ dưỡng, béo bùi, giàu chất xơ',
                'price': 23000,
                'category_slug': 'banh-quy',
                'stock': 90,
                'sold': 170,
                'rating': 4.5,
                'review_count': 125,
                'image': 'https://images.unsplash.com/photo-1599599815301-f2ee6b0b0c110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bánh quy bơ tươi',
                'description': 'Bánh bơ tươi, bùi bùi, bơ thơm', 
                'price': 24000,
                'category_slug': 'banh-quy',
                'stock': 85,
                'sold': 175,
                'rating': 4.6,
                'review_count': 135,
                'image': 'https://images.unsplash.com/photo-1599599815303-f2ee6b0b0c120?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            # Hạt dinh dưỡng (10 items)
            {
                'name': 'Hạt dưa rang muối',
                'description': 'Hạt dưa rang bổ dưỡng, giàu vitamin E',
                'price': 35000,
                'category_slug': 'hat-dinh-duong',
                'stock': 60,
                'sold': 150,
                'rating': 4.3,
                'review_count': 45,
                'image': 'https://images.unsplash.com/photo-1585228946309-e0ccb8eb7d50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt óc chó rang mật ong',
                'description': 'Óc chó rang vị mật ong ngọt ngào, giàu omega',
                'price': 45000,
                'category_slug': 'hat-dinh-duong',
                'stock': 50,
                'sold': 120,
                'rating': 4.5,
                'review_count': 65,
                'image': 'https://images.unsplash.com/photo-1599599815305-f2ee6b0b0c130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt điều rang muối',
                'description': 'Điều rang, giàu chất béo tốt, ngon lành',
                'price': 55000,
                'category_slug': 'hat-dinh-duong',
                'stock': 55,
                'sold': 130,
                'rating': 4.6,
                'review_count': 85,
                'image': 'https://images.unsplash.com/photo-1599599815307-f2ee6b0b0c140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt lạc rang bơ',
                'description': 'Lạc rang bơ thơm, giàu protein và chất xơ',
                'price': 28000,
                'category_slug': 'hat-dinh-duong',
                'stock': 70,
                'sold': 160,
                'rating': 4.4,
                'review_count': 72,
                'image': 'https://images.unsplash.com/photo-1599599815309-f2ee6b0b0c150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt hướng dương rang',
                'description': 'Hạt hướng dương bổ dưỡng, vị mặn nhẹ',
                'price': 32000,
                'category_slug': 'hat-dinh-duong',
                'stock': 65,
                'sold': 145,
                'rating': 4.3,
                'review_count': 68,
                'image': 'https://images.unsplash.com/photo-1599599815311-f2ee6b0b0c160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt bí ngô rang',
                'description': 'Bí ngô rang nước mắm, giàu khoáng chất',
                'price': 25000,
                'category_slug': 'hat-dinh-duong',
                'stock': 75,
                'sold': 140,
                'rating': 4.2,
                'review_count': 60,
                'image': 'https://images.unsplash.com/photo-1599599815313-f2ee6b0b0c170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt hồi mặn',
                'description': 'Hồi rang mặn, vị lạ, hỗ trợ tiêu hóa',
                'price': 20000,
                'category_slug': 'hat-dinh-duong',
                'stock': 80,
                'sold': 130,
                'rating': 4.1,
                'review_count': 55,
                'image': 'https://images.unsplash.com/photo-1599599815315-f2ee6b0b0c180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt mỵ nướng',
                'description': 'Mỵ nướng nước mắm, hương thơm đặc trưng',
                'price': 38000,
                'category_slug': 'hat-dinh-duong',
                'stock': 60,
                'sold': 110,
                'rating': 4.4,
                'review_count': 70,
                'image': 'https://images.unsplash.com/photo-1599599815317-f2ee6b0b0c190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Hạt gạo siêu bổ dưỡng',
                'description': 'Hạo gạo lức rang, giàu vitamin nhóm B',
                'price': 22000,
                'category_slug': 'hat-dinh-duong',
                'stock': 85,
                'sold': 125,
                'rating': 4.3,
                'review_count': 65,
                'image': 'https://images.unsplash.com/photo-1599599815319-f2ee6b0b0c200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            # Bắp rang (10 items)
            {
                'name': 'Bắp rang bơ',
                'description': 'Bắp rang giòn rụm vị bơ thơm lừng',
                'price': 18000,
                'category_slug': 'bap-rang',
                'stock': 100,
                'sold': 280,
                'rating': 4.6,
                'review_count': 130,
                'image': 'https://images.unsplash.com/photo-1599599815321-f2ee6b0b0c210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang caramel',
                'description': 'Bắp rang vị caramel ngọt ngào, khó cưỡng',
                'price': 20000,
                'category_slug': 'bap-rang',
                'stock': 90,
                'sold': 250,
                'rating': 4.5,
                'review_count': 120,
                'image': 'https://images.unsplash.com/photo-1599599815323-f2ee6b0b0c220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang pho mai',
                'description': 'Bắp phô mai béo ngậy, vị cheese thơm lừng',
                'price': 19000,
                'category_slug': 'bap-rang',
                'stock': 95,
                'sold': 260,
                'rating': 4.4,
                'review_count': 125,
                'image': 'https://images.unsplash.com/photo-1599599815325-f2ee6b0b0c230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang nước mắm',
                'description': 'Bắp nước mắm vị mặn cay, ăn quên cơm',
                'price': 17000,
                'category_slug': 'bap-rang',
                'stock': 110,
                'sold': 240,
                'rating': 4.3,
                'review_count': 115,
                'image': 'https://images.unsplash.com/photo-1599599815327-f2ee6b0b0c240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang ớt cay',
                'description': 'Bắp ớt cay ngọn, vị cay mồm, kích thích vị giác',
                'price': 16000,
                'category_slug': 'bap-rang',
                'stock': 120,
                'sold': 220,
                'rating': 4.2,
                'review_count': 100,
                'image': 'https://images.unsplash.com/photo-1599599815329-f2ee6b0b0c250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang vani',
                'description': 'Bắp vani, vị ngọt tinh tế, hương thơm lãng mạn',
                'price': 21000,
                'category_slug': 'bap-rang',
                'stock': 85,
                'sold': 200,
                'rating': 4.5,
                'review_count': 110,
                'image': 'https://images.unsplash.com/photo-1599599815331-f2ee6b0b0c260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang nước mắm cà chua',
                'description': 'Bắp mặn chua, vị đặc biệt, hấp dẫn',
                'price': 18500,
                'category_slug': 'bap-rang',
                'stock': 100,
                'sold': 230,
                'rating': 4.4,
                'review_count': 118,
                'image': 'https://images.unsplash.com/photo-1599599815333-f2ee6b0b0c270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang caramen & muối',
                'description': 'Bắp ngọt mặn cân bằng,  hợp khẩu vị mọi người',
                'price': 20500,
                'category_slug': 'bap-rang',
                'stock': 92,
                'sold': 235,
                'rating': 4.5,
                'review_count': 122,
                'image': 'https://images.unsplash.com/photo-1599599815335-f2ee6b0b0c280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Bắp rang dâu tây',
                'description': 'Bắp dâu tây ngọt, hương dâu tây tự nhiên nhẹ nhàng',
                'price': 22000,
                'category_slug': 'bap-rang',
                'stock': 88,
                'sold': 210,
                'rating': 4.3,
                'review_count': 108,
                'image': 'https://images.unsplash.com/photo-1599599815337-f2ee6b0b0c290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            # Đồ uống (10 items)
            {
                'name': 'Nước cam tươi',
                'description': 'Nước cam tự nhiên 100%, giàu vitamin C',
                'price': 20000,
                'category_slug': 'do-uong',
                'stock': 50,
                'sold': 400,
                'rating': 4.8,
                'review_count': 250,
                'image': 'https://images.unsplash.com/photo-1599599815339-f2ee6b0b0c300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Nước dâu tây sữa',
                'description': 'Nước dâu tây sữa tươi, béo bùi và ngon',
                'price': 22000,
                'category_slug': 'do-uong',
                'stock': 55,
                'sold': 350,
                'rating': 4.6,
                'review_count': 220,
                'image': 'https://images.unsplash.com/photo-1599599815341-f2ee6b0b0c310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Nước dừa tươi',
                'description': 'Nước dừa tươi, mát lạnh, giàu chất khoáng',
                'price': 18000,
                'category_slug': 'do-uong',
                'stock': 65,
                'sold': 380,
                'rating': 4.7,
                'review_count': 240,
                'image': 'https://images.unsplash.com/photo-1599599815343-f2ee6b0b0c320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Cà phê đen đá',
                'description': 'Cà phê nguyên chất rang xay, đắng đang ngon',
                'price': 15000,
                'category_slug': 'do-uong',
                'stock': 80,
                'sold': 450,
                'rating': 4.5,
                'review_count': 280,
                'image': 'https://images.unsplash.com/photo-1599599815345-f2ee6b0b0c330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Trà xanh matcha',
                'description': 'Trà xanh matcha Nhật Bản, rất tốt cho sức khỏe',
                'price': 25000,
                'category_slug': 'do-uong',
                'stock': 40,
                'sold': 200,
                'rating': 4.6,
                'review_count': 150,
                'image': 'https://images.unsplash.com/photo-1599599815347-f2ee6b0b0c340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Nước nho tím',
                'description': 'Nước nho tím tự nhiên, giàu chất chống oxy hóa',
                'price': 21000,
                'category_slug': 'do-uong',
                'stock': 60,
                'sold': 320,
                'rating': 4.5,
                'review_count': 180,
                'image': 'https://images.unsplash.com/photo-1599599815349-f2ee6b0b0c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Soda chanh',
                'description': 'Nước soda chanh mát lạnh, giải khát tốt',
                'price': 12000,
                'category_slug': 'do-uong',
                'stock': 100,
                'sold': 500,
                'rating': 4.4,
                'review_count': 250,
                'image': 'https://images.unsplash.com/photo-1599599815351-f2ee6b0b0c360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Sữa tươi đặc biệt',
                'description': 'Sữa tươi 100%, tiếp tục nguyên chất',
                'price': 35000,
                'category_slug': 'do-uong',
                'stock': 45,
                'sold': 320,
                'rating': 4.7,
                'review_count': 200,
                'image': 'https://images.unsplash.com/photo-1599599815353-f2ee6b0b0c370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Nước xoài chua ngọt',
                'description': 'Nước xoài tự nhiên, vị xoài đặc, chua ngọt cân bằng',
                'price': 19000,
                'category_slug': 'do-uong',
                'stock': 70,
                'sold': 380,
                'rating': 4.5,
                'review_count': 190,
                'image': 'https://images.unsplash.com/photo-1599599815355-f2ee6b0b0c380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
            {
                'name': 'Sinh tố dâu tây bơ',
                'description': 'Sinh tố dâu tây bơ mịn, giàu dưỡng chất',
                'price': 23000,
                'category_slug': 'do-uong',
                'stock': 50,
                'sold': 280,
                'rating': 4.6,
                'review_count': 170,
                'image': 'https://images.unsplash.com/photo-1599599815357-f2ee6b0b0c390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
            },
        ]
        
        for prod_data in products_data:
            category = Category.objects.get(slug=prod_data.pop('category_slug'))
            
            if not Product.objects.filter(name=prod_data['name']).exists():
                product = Product.objects.create(
                    **prod_data,
                    category=category,
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Created product: {product.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'✗ Product already exists: {prod_data["name"]}'))
        
        self.stdout.write(self.style.SUCCESS('✓ Database population completed successfully!'))
