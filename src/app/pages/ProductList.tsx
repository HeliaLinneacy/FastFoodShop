import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchParams } from 'react-router';
import { useData } from '../contexts/DataContext';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

const TEXT = {
  title: "Sản phẩm",
  searchPlaceholder: "Tìm kiếm sản phẩm...",
  allCategory: "Tất cả danh mục",
  sortName: "Tên A-Z",
  sortPriceAsc: "Giá thấp đến cao",
  sortPriceDesc: "Giá cao đến thấp",
  sortRating: "Đánh giá cao nhất",
  sortSold: "Bán chạy nhất",
  result: "Tìm thấy",
  noResult: "Không tìm thấy sản phẩm nào",
};

const containerClass = "container mx-auto px-4";
export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products = [], categories = [] } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

  const query = searchQuery.toLowerCase();

  let filtered = products;

  if (query) {
    filtered = products.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter((p) => p.categoryId === selectedCategory);
  }

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'sold':
        return b.sold - a.sold;
      default:
        return a.name.localeCompare(b.name);
    }
  });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleCategoryChange = useCallback((value: string) => {
  setSelectedCategory(value);

  const params = new URLSearchParams(searchParams);

  if (value === 'all') {
    params.delete('category');
  } else {
    params.set('category', value);
  }

  setSearchParams(params);
}, [searchParams, setSearchParams]);

  return (
    <div className={`${containerClass} py-8`}>
      <h1 className="text-3xl font-bold mb-8">{TEXT.title}</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={TEXT.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{TEXT.allCategory}</SelectItem>
              {categories.length > 0 ? categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="sold">Bán chạy nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-gray-600">
        Tìm thấy {filteredProducts.length} sản phẩm
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
        </div>
      )}
    </div>
  );
}
