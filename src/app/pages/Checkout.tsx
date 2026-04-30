import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

export function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, clearCart, getCartTotal } = useCart();
  const { products, addOrder } = useData();

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    note: '',
  });

  const cartItems = cart
  .map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }))
  .filter((item) => item.product);

  const total = getCartTotal(products);

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    const orderItems = cartItems.map(({ product, quantity, productId }) => ({
      id: `item-${Date.now()}-${productId}`,
      productId,
      productName: product!.name,
      productImage: product!.image,
      price: product!.price,
      quantity,
      subtotal: product!.price * quantity,
    }));

    addOrder({
      userId: currentUser.id,
      items: orderItems,
      total,
      status: 'pending',
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      customerAddress: formData.address,
      note: formData.note || undefined,
    });

    clearCart();
    toast.success('Đặt hàng thành công!');
    navigate('/orders');
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để tiếp tục đặt hàng
          </p>
          <Button onClick={() => navigate('/login')} className="bg-orange-500 hover:bg-orange-600">
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Thông tin khách hàng</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ nhận hàng *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ghi chú về đơn hàng (tùy chọn)"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Đơn hàng của bạn</h3>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map(({ product, quantity, productId }) => {
                    if (!product) return null;
                    
                    return (
                      <div key={productId} className="flex gap-3 text-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1">{product.name}</div>
                          <div className="text-gray-600">x{quantity}</div>
                        </div>
                        <div className="font-medium">
                          {formatPrice(product.price * quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">Miễn phí</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-orange-500">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Đặt hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
