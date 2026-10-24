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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

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
    { label: "Men's Footwear", href: '/shop?department=MEN' },
    { label: "Women's Footwear", href: '/shop?department=WOMEN' },
    { label: "Kids' Footwear", href: '/shop?department=KIDS' },
    {
      label: 'Categories',
      href: '/categories',
      badge: 'New',
    },
    {
      label: 'Slippers & Sandals',
      href: '/slippers',
      highlight: true,
      badge: 'CloudStep',
    },
    { label: 'New Arrivals', href: '/shop?sortBy=newest' },
    { label: 'Offers', href: '/shop?sortBy=best_selling' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Emblem */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg
                viewBox="0 0 100 100"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current filter drop-shadow"
              >
                <path d="M15 65 Q 38 78 78 55 Q 90 42 80 32 Q 62 38 46 52 Q 28 60 15 65 Z" />
                <circle cx="72" cy="28" r="5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-sm sm:text-lg md:text-xl tracking-tight text-slate-900 group-hover:text-red-600 transition-colors leading-none">
                CHANDHANA
              </span>
              <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-black text-red-600">
                SHOE MART
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href.includes('?') && location.search.includes(link.href.split('?')[1]));

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-red-600 bg-red-50'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                  } ${link.highlight ? 'text-red-600 font-extrabold' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full font-bold bg-red-600 text-white shadow-sm">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-3 h-0.5 bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons Right (BORDERLESS) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="border-none flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 transition-all"
              title="Search footwear (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-red-600" />
              <span className="hidden xl:inline text-xs text-slate-500 font-medium">Search</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="border-none relative p-2.5 rounded-xl text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 transition-all"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={toggleCart}
              className="border-none relative p-2.5 rounded-xl text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-red-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-red-500/30">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="border-none flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 border border-slate-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          My Orders & Tracking
                        </Link>

                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors mt-1"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={logout}
                          className="w-full border-none flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
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
                  className="btn-primary text-xs py-2 sm:py-2.5 px-2.5 sm:px-5 font-bold flex items-center gap-1.5 border-none shadow-sm cursor-pointer"
                  title="Sign In / Register"
                >
                  <UserIcon className="w-3.5 h-3.5 sm:hidden" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="border-none lg:hidden p-2 rounded-xl text-slate-700 hover:text-red-600 bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full border-none flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-800"
            >
              <Search className="w-4 h-4 text-red-600" />
              <span>Search Shoes & Slippers</span>
            </button>

            {!user && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full btn-primary py-3 text-xs font-bold"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
