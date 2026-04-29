import { useState, useMemo, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';
import { Eye } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { toast } from 'sonner';

const TEXT = {
  title: 'Quản lý đơn hàng',
  filterPlaceholder: 'Lọc theo trạng thái',
  total: 'Tổng cộng:',
};

const containerClass = 'container mx-auto px-4';
export function AdminOrders() {
  const { orders, updateOrder } = useData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = useMemo(() => {
  if (!orders.length) return [];

  return orders
    .filter((o) => filterStatus === 'all' || o.status === filterStatus)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}, [orders, filterStatus]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrder(orderId, { status: newStatus });
    toast.success('Đã cập nhật trạng thái đơn hàng');
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

      {/* Filter */}
      <div className="mb-6 max-w-xs">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đơn hàng</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>{order.customerName}</div>
                    <div className="text-sm text-gray-600">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="font-bold text-orange-500">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="font-medium">{selectedOrder.customerName}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Điện thoại:</span>
                    <span className="font-medium">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-medium">{selectedOrder.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Sản phẩm</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex gap-3 border-b pb-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(item.price)} x {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold">{formatPrice(item.subtotal)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-500">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Cập nhật trạng thái</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="shipping">Đang giao</SelectItem>
                    <SelectItem value="delivered">Đã giao</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedOrder.note && (
                <div>
                  <h3 className="font-semibold mb-2">Ghi chú</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.note}</p>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <div>Ngày đặt: {formatDate(selectedOrder.createdAt)}</div>
                <div>Cập nhật lần cuối: {formatDate(selectedOrder.updatedAt)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
