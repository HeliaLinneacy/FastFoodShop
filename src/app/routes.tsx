import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Statistics } from './pages/admin/Statistics';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'products', Component: ProductList },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'orders', Component: Orders },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'profile', Component: Profile },
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'products', Component: AdminProducts },
          { path: 'categories', Component: AdminCategories },
          { path: 'orders', Component: AdminOrders },
          { path: 'users', Component: AdminUsers },
          { path: 'statistics', Component: Statistics },
        ],
      },
    ],
  },
]);
