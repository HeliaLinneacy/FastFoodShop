import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TEXT = {
  notFound: "Không tìm thấy sản phẩm",
  back: "Quay lại",
  addToCart: "Thêm vào giỏ hàng",
  buyNow: "Mua ngay",
  description: "Mô tả sản phẩm",
  stock: "Còn lại",
  sold: "Đã bán",
  quantity: "Số lượng",
  reviewTitle: "Đánh giá sản phẩm",
  writeReview: "Viết đánh giá của bạn",
  rating: "Đánh giá",
  comment: "Nhận xét",
  submit: "Gửi đánh giá",
  noReview: "Chưa có đánh giá nào",
};
export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getCategoryById, getReviewsByProductId, addReview } = useData();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = useMemo(() => {
  if (!id) return null;
  return getProductById(id);
}, [id, getProductById]);

const category = useMemo(() => {
  if (!product) return null;
  return getCategoryById(product.categoryId);
}, [product, getCategoryById]);

const reviews = useMemo(() => {
  if (!product) return [];
  return getReviewsByProductId(product.id);
}, [product, getReviewsByProductId]);
  if (!product) {
    return (
      <div className={`${containerClass} py-12 text-center`}>
        <p className="text-gray-500">{TEXT.notFound}</p>
        <Button onClick={goProducts} className="mt-4">
          {TEXT.back}
        </Button>
      </div>
    );
  }

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    toast.success(`Chuyển đến thanh toán`);
    navigate('/checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      navigate('/login');
      return;
    }

    addReview({
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      rating,
      comment,
    });

    toast.success('Đã thêm đánh giá của bạn');
    setComment('');
    setRating(5);
  };

  return (
    <div className={`${containerClass} py-8`}>
      <Button
        variant="ghost"
        onClick={goBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {TEXT.back}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="text-sm text-gray-500 mb-2">{category?.name}</div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.reviewCount} đánh giá)</span>
          </div>

          <div className="text-3xl font-bold text-orange-500 mb-6">
            {formatPrice(product.price)}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">{TEXT.description}</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="text-gray-500">{TEXT.stock}:</span>
              <span className="ml-2 font-medium">{product.stock} sản phẩm</span>
            </div>
            <div>
              <span className="text-gray-500">{TEXT.sold}:</span>
              <span className="ml-2 font-medium">{product.sold}</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">{TEXT.quantity}:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {TEXT.addToCart}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-red-500 hover:bg-red-600"
              size="lg"
            >
              {TEXT.buyNow}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-bold mb-6">{TEXT.reviewTitle}</h2>

        {/* Add Review Form */}
        {currentUser && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{TEXT.writeReview}</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {TEXT.rating}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {TEXT.comment}
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    required
                    rows={4}
                  />
                </div>
                <Button type="submit">{TEXT.submit}</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review.id ?? review.createdAt}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{review.userName}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Chưa có đánh giá nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
