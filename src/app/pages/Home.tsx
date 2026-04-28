import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ArrowRight, Package } from 'lucide-react';
import { useMemo } from 'react';

export function Home() {
  const { products = [], categories = [] } = useData();
  const FEATURED_LIMIT = 8;

const TEXT = {
  title: "Chào mừng đến với SnackShop",
  subtitle: "Hàng ngàn sản phẩm đồ ăn vặt chất lượng cao, giao hàng nhanh chóng",
  explore: "Khám phá ngay",
  categories: "Danh mục sản phẩm",
  featured: "Sản phẩm nổi bật",
  viewAll: "Xem tất cả",
};

const containerClass = "container mx-auto px-4";
if (!products || !categories) return null;

  // Get featured products (top rated)
  const featuredProducts = useMemo(() => {
  return [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
}, [products]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {TEXT.title}
            </h1>
            <p className="text-lg mb-8 text-orange-50">
              {TEXT.subtitle}
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
                Khám phá ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-shadow border"
              >
                <div className="flex h-12 w-12 mx-auto mb-3 items-center justify-center rounded-full bg-orange-100">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
            <Link to="/products">
              <Button variant="outline">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {products.length}+
              </div>
              <div className="text-gray-600">Sản phẩm</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600">Khách hàng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                4.8★
              </div>
              <div className="text-gray-600">Đánh giá</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
