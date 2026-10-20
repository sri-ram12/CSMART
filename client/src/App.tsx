import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/layout/Navbar';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import SlippersPage from './pages/SlippersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
              <AnnouncementBar />
              <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              <CartDrawer />

              <main className="flex-1">
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/slippers" element={<SlippersPage />} />
                  <Route path="/sandals" element={<Navigate to="/slippers" replace />} />
                  <Route path="/men" element={<Navigate to="/shop?department=MEN" replace />} />
                  <Route path="/women" element={<Navigate to="/shop?department=WOMEN" replace />} />
                  <Route path="/kids" element={<Navigate to="/shop?department=KIDS" replace />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmed/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="/orders" element={<OrderTrackingPage />} />
                  <Route path="/orders/:idOrNumber" element={<OrderTrackingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/inventory" element={<AdminInventoryPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
