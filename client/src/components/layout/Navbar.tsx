import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  Package,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CSMAnimatedLogo } from '../common/CSMAnimatedLogo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Men's", href: '/shop?department=MEN' },
    { label: "Women's", href: '/shop?department=WOMEN' },
    { label: "Kids'", href: '/shop?department=KIDS' },
    {
      label: 'Slippers',
      fullLabel: 'Slippers & Sandals',
      href: '/slippers',
      highlight: true,
      badge: 'CloudStep',
    },
    {
      label: '3D Collection',
      href: '/shop?has3D=true',
      badge: '360°',
    },
    {
      label: 'Categories',
      href: '/categories',
    },
    { label: 'Offers', href: '/shop?sortBy=best_selling' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/70 shadow-xs transition-all">
      <div className="w-full px-2.5 sm:px-5 lg:px-7">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* ========================================================
              LEFT SIDE: Logo + ALL OPTIONS (Search, Wishlist, Cart, User, Phone)
             ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {/* Animated CSM Brand Logo with Effective Footprints & Powerful Slogan */}
            <div className="shrink-0">
              <CSMAnimatedLogo variant="navbar" />
            </div>

            {/* Separator Divider */}
            <div className="hidden sm:block h-8 w-px bg-purple-100 shrink-0 mx-0.5" />

            {/* ALL ACTION OPTIONS PLACED AT THE LEFT SIDE */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Official Cell Call Badge */}
              <a
                href="tel:9553536884"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F5F3FF] text-[#5B21B6] hover:bg-[#EDE9FE] ring-1 ring-purple-200/80 font-black text-xs transition-all shadow-2xs"
                title="Call Chandhana Shoe Mart: 9553536884"
              >
                <Phone className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                <span>Cell: 9553536884</span>
              </a>

              {/* Search Option */}
              <button
                onClick={onOpenSearch}
                className="border-none flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[#5B21B6] hover:text-[#4C1D95] bg-[#FAF7FD] hover:bg-[#F3EBFA] ring-1 ring-purple-100 transition-all cursor-pointer shadow-2xs"
                title="Search footwear (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[#5B21B6]" />
                <span className="hidden min-[1100px]:inline text-xs text-[#7C3AED] font-semibold">Search</span>
              </button>

              {/* Wishlist Option */}
              <Link
                to="/wishlist"
                className="border-none relative p-1.5 sm:p-2 rounded-full text-[#5B21B6] hover:text-[#4C1D95] bg-[#FAF7FD] hover:bg-[#F3EBFA] ring-1 ring-purple-100 transition-all shadow-2xs"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart / Shopping Bag Option */}
              <button
                onClick={toggleCart}
                className="border-none relative p-1.5 sm:p-2 rounded-full text-[#5B21B6] hover:text-[#4C1D95] bg-[#FAF7FD] hover:bg-[#F3EBFA] ring-1 ring-purple-100 transition-all cursor-pointer shadow-2xs"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#5B21B6]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5B21B6] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account / Sign In Option */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="border-none flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full bg-[#FAF7FD] hover:bg-[#F3EBFA] ring-1 ring-purple-100 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#5B21B6] flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold text-[#5B21B6] max-w-[80px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div
                        className="absolute left-0 mt-2 w-52 rounded-2xl bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 border border-purple-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="px-3 py-2 border-b border-purple-50">
                          <p className="text-xs font-bold text-[#3B0764] truncate">{user.name}</p>
                          <p className="text-[11px] text-purple-700 truncate">{user.email}</p>
                          {user.role === 'ADMIN' && (
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#5B21B6] px-2 py-0.5 rounded-full">
                              Administrator
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-[#F5F3FF] hover:text-[#5B21B6] transition-colors"
                          >
                            <UserIcon className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-[#F5F3FF] hover:text-[#5B21B6] transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            My Orders & Tracking
                          </Link>

                          {user.role === 'ADMIN' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#5B21B6] bg-[#EDE9FE] hover:bg-[#DDD6FE] transition-colors mt-1"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              Admin Console
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-purple-50 pt-1">
                          <button
                            onClick={logout}
                            className="border-none w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary text-xs py-1.5 sm:py-2 px-4 sm:px-5 font-bold border-none shadow-xs cursor-pointer rounded-full"
                  >
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT SIDE: Desktop Navigation Links + Mobile Hamburger
             ======================================================== */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {/* Desktop Department & Collection Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href.includes('?') && location.search.includes(link.href.split('?')[1]));

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-[#5B21B6] bg-[#EDE9FE] shadow-2xs font-extrabold'
                        : 'text-slate-700 hover:text-[#5B21B6] hover:bg-[#FAF7FD]'
                    } ${link.highlight ? 'text-[#5B21B6] font-extrabold' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      <span className="hidden xl:inline">{link.fullLabel || link.label}</span>
                      <span className="xl:hidden">{link.label}</span>
                      {link.badge && (
                        <span className="text-[8.5px] uppercase px-1.5 py-0.2 rounded-full font-black bg-[#5B21B6] text-white shadow-2xs">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#5B21B6] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden border-none p-2 rounded-xl text-[#5B21B6] hover:bg-[#F3EBFA] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-purple-100 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4">
          <div className="pb-3 border-b border-purple-50 flex items-center justify-between">
            <CSMAnimatedLogo variant="navbar" showTagline={false} />
            <a
              href="tel:9553536884"
              className="px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] ring-1 ring-purple-200 text-[11px] font-black flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#5B21B6]" />
              <span>9553536884</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-[#F5F3FF] hover:text-[#5B21B6] font-bold text-slate-800 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-[#5B21B6] text-white px-2 py-0.5 rounded-full font-black">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-purple-50 text-center">
            <p className="text-[11px] font-bold text-[#5B21B6] font-serif">
              పాదరక్షల బృందావనం • Opp: Tata Theatre, Tagarapuvalasa
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
