import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Order, Review } from '../types';
import { initialProducts, initialCategories, initialOrders, initialReviews } from '../data/mockData';

interface DataContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  getReviewsByProductId: (productId: string) => Review[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem('snackshop_products');
    const storedCategories = localStorage.getItem('snackshop_categories');
    const storedOrders = localStorage.getItem('snackshop_orders');
    const storedReviews = localStorage.getItem('snackshop_reviews');

    setProducts(storedProducts ? JSON.parse(storedProducts) : initialProducts);
    setCategories(storedCategories ? JSON.parse(storedCategories) : initialCategories);
    setOrders(storedOrders ? JSON.parse(storedOrders) : initialOrders);
    setReviews(storedReviews ? JSON.parse(storedReviews) : initialReviews);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('snackshop_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('snackshop_categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('snackshop_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('snackshop_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Order operations
  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);

    // Update product sold count and stock
    order.items.forEach(item => {
      updateProduct(item.productId, {
        sold: (products.find(p => p.id === item.productId)?.sold || 0) + item.quantity,
        stock: (products.find(p => p.id === item.productId)?.stock || 0) - item.quantity,
      });
    });
  };

  const updateOrder = (id: string, data: Partial<Order>) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Review operations
  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);

    // Update product rating
    const productReviews = [...reviews.filter(r => r.productId === review.productId), newReview];
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    updateProduct(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: productReviews.length,
    });
  };

  // Helper functions
  const getProductById = (id: string) => products.find(p => p.id === id);
  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getOrdersByUserId = (userId: string) => orders.filter(o => o.userId === userId);
  const getReviewsByProductId = (productId: string) => reviews.filter(r => r.productId === productId);

  const value: DataContextType = {
    products,
    categories,
    orders,
    reviews,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addOrder,
    updateOrder,
    deleteOrder,
    addReview,
    getProductById,
    getCategoryById,
    getOrdersByUserId,
    getReviewsByProductId,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
