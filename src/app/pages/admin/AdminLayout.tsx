import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, BarChart3 } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập trang quản trị
          </p>
          <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const menuItems => [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Sản phẩm', icon: Package },
    { path: '/admin/categories', label: 'Danh mục', icon: Tag },
    { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingBag },
    { path: '/admin/users', label: 'Người dùng', icon: Users },
    { path: '/admin/statistics', label: 'Thống kê', icon: BarChart3 },
  ];
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Quản trị viên</h2>
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start transition-colors ${
                      isActive ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
