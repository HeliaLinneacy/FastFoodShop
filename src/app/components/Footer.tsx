import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-orange-500">SnackShop</span>
            </div>
            <p className="text-sm text-gray-600">
              Cửa hàng đồ ăn vặt trực tuyến uy tín, chất lượng cao
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-orange-500">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-orange-500">Liên hệ</a></li>
              <li><a href="#" className="hover:text-orange-500">Tuyển dụng</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-orange-500">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-orange-500">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-orange-500">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@snackshop.com</li>
              <li>Hotline: 1900 1234</li>
              <li>Giờ làm việc: 8:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          © 2026 SnackShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
