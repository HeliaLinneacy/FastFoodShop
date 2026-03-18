import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

export function Dashboard() {
  const { products, orders, categories } = useData();
  const { users } = useAuth();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.filter(u => u.role === 'user').length;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippingOrders = orders.filter(o => o.status === 'shipping').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const stats = [
    {
      title: 'Tổng doanh thu',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Đơn hàng',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Sản phẩm',
      value: totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: 'Người dùng',
      value: totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Tình trạng đơn hàng</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium">Chờ xác nhận</span>
                <span className="text-2xl font-bold text-yellow-600">{pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">Đang giao hàng</span>
                <span className="text-2xl font-bold text-blue-600">{shippingOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Đơn hàng gần đây</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">#{order.id}</div>
                      <div className="text-xs text-gray-600">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-orange-500">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">{order.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Chưa có đơn hàng</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="font-semibold text-lg">Danh mục sản phẩm</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              return (
                <div key={cat.id} className="p-4 border rounded-lg text-center">
                  <div className="font-semibold mb-1">{cat.name}</div>
                  <div className="text-2xl font-bold text-orange-500">{catProducts.length}</div>
                  <div className="text-xs text-gray-600">sản phẩm</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
