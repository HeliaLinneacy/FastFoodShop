import { useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/card';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Package } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Orders() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getOrdersByUserId } = useData();
  const TEXT = {
  loginRequired: "Vui lòng đăng nhập",
  loginDesc: "Bạn cần đăng nhập để xem đơn hàng",
  loginBtn: "Đăng nhập",
  emptyTitle: "Chưa có đơn hàng nào",
  emptyDesc: "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!",
  shopNow: "Mua sắm ngay",
  myOrders: "Đơn hàng của tôi",
  total: "Tổng tiền",
};
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{TEXT.loginRequired}</h2>
          <p className="text-gray-600 mb-6">
            {TEXT.loginDesc}
          </p>
          <Button onClick={() => navigate('/login')} className="bg-orange-500 hover:bg-orange-600">
            {TEXT.loginBtn}
          </Button>
        </div>
      </div>
    );
  }

  const orders = useMemo(() => {
  if (!currentUser) return [];
  return getOrdersByUserId(currentUser.id)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}, [currentUser, getOrdersByUserId]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{TEXT.emptyTitle}</h2>
          <p className="text-gray-600 mb-6">
            {TEXT.emptyDesc}
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {TEXT.shopNow}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{TEXT.myOrders}</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="text-sm text-gray-600">
                    Đặt ngày: {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">{TEXT.total}</div>
                  <div className="text-lg font-bold text-orange-500">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage || '/placeholder.png'}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(item.price)} x {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.note && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">Ghi chú: {order.note}</div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <div>Người nhận: {order.customerName}</div>
                <div>Số điện thoại: {order.customerPhone}</div>
                <div>Địa chỉ: {order.customerAddress}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
