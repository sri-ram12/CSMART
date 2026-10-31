import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { PWAInstallModal } from './components/common/PWAInstallModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoriesPage from './pages/CategoriesPage';
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
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminVideoAdsPage from './pages/admin/AdminVideoAdsPage';
import { AdminRoute } from './components/admin/AdminRoute';

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Customer storefront layout — Navbar, Footer, MobileBottomNav */
function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <PWAInstallModal />
    </div>
  );
}

/** Admin layout — plain full-screen, zero customer chrome */
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {children}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>

              {/* ── Admin routes (no customer layout) ── */}
              <Route path="/admin/login" element={
                <AdminLayout><AdminLoginPage /></AdminLayout>
              } />
              <Route path="/admin" element={
                <AdminLayout><AdminRoute><AdminDashboardPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/products" element={
                <AdminLayout><AdminRoute><AdminProductsPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/enquiries" element={
                <AdminLayout><AdminRoute><AdminEnquiriesPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout><AdminRoute><AdminEnquiriesPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/inventory" element={
                <AdminLayout><AdminRoute><AdminInventoryPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/video-ads" element={
                <AdminLayout><AdminRoute><AdminVideoAdsPage /></AdminRoute></AdminLayout>
              } />
              <Route path="/admin/settings" element={
                <AdminLayout><AdminRoute><AdminSettingsPage /></AdminRoute></AdminLayout>
              } />

              {/* ── Customer storefront routes (with Navbar/Footer) ── */}
              <Route path="/*" element={
                <StorefrontLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
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
                  </Routes>
                </StorefrontLayout>
              } />

            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
