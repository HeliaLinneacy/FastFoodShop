import { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function Statistics() {
  const { orders, products, categories } = useData();

  // Revenue by month
  const revenueByMonth = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + order.total;
    });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .slice(-6);
  }, [orders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      statusCount[order.status]++;
    });

    return [
      { name: 'Chờ xác nhận', value: statusCount.pending, color: '#fbbf24' },
      { name: 'Đã xác nhận', value: statusCount.confirmed, color: '#3b82f6' },
      { name: 'Đang giao', value: statusCount.shipping, color: '#8b5cf6' },
      { name: 'Đã giao', value: statusCount.delivered, color: '#10b981' },
      { name: 'Đã hủy', value: statusCount.cancelled, color: '#ef4444' },
    ];
  }, [orders]);

  // Top selling products
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
      .map(p => ({ name: p.name, sold: p.sold }));
  }, [products]);

  // Products by category
  const productsByCategory = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.categoryId === cat.id).length,
    }));
  }, [products, categories]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Thống kê & Báo cáo</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Giá trị đơn trung bình</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(avgOrderValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-orange-600">
              {orders.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Doanh thu theo tháng</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatPrice(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" name="Doanh thu" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Đơn hàng theo trạng thái</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Top 10 sản phẩm bán chạy</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" fill="#f97316" name="Đã bán" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Products by Category */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Sản phẩm theo danh mục</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
