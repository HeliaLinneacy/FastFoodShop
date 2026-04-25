import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { products } = useData();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = getCartTotal(products);

 const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`Đã xóa ${productName} khỏi giỏ hàng`);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link to="/products">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cartItems.map(({ product, quantity, productId }) => {
                  if (!product) return null;
                  
                  return (
                    <div
                      key={productId}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/products/${product.id}`}
                          className="font-semibold hover:text-orange-500"
                        >
                          {product.name}
                        </Link>
                        <div className="text-orange-500 font-bold mt-1">
                          {formatPrice(product.price)}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(productId, quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(productId, quantity + 1)}
                              disabled={quantity >= product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(productId, product.name)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-bold">
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
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
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                Tiến hành thanh toán
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full mt-3">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
