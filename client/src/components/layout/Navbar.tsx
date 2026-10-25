import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Box,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CSMAnimatedLogo } from '../common/CSMAnimatedLogo';
import { OWNER_PHONE, getWhatsAppGeneralInquiryUrl, STORE_LANDMARK } from '../../utils/whatsapp';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // All store categories & collections up to customer reviews and ratings as requested
  const DRAWER_CATEGORIES = [
    {
      label: "Men's Footwear",
      desc: 'Running, Formal Derby, Loafers & Kicks',
      href: '/shop?department=MEN',
      badge: 'Popular',
    },
    {
      label: "Women's Footwear",
      desc: 'Bridal Heels, Flats, Fur-Lined Boots',
      href: '/shop?department=WOMEN',
      badge: 'Trending',
    },
    {
      label: "Kids' Collection",
      desc: 'School Shoes, Active Kicks & Sports',
      href: '/shop?department=KIDS',
    },
    {
      label: 'Slippers & Sandals',
      desc: 'Orthopedic CloudStep, Slides & Comfort Wear',
      href: '/slippers',
      badge: 'CloudStep',
      highlight: true,
    },
    {
      label: 'Fur-Lined Winter Boots',
      desc: 'Reference 5-Color Winter Boots Collection',
      href: '/shop?category=boots',
      badge: 'Winter Drop',
    },
    {
      label: '3D 360° Interactive Showcase',
      desc: 'Rotate, inspect sole tread & materials in 3D',
      href: '/shop?has3D=true',
      badge: '360° WebGL',
      icon: <Box className="w-4 h-4 text-purple-600" />,
    },
    {
      label: 'Best Sellers',
      desc: 'Top customer favorites & highest rated shoes',
      href: '/shop?sortBy=best_selling',
      badge: 'Top Rated',
    },
    {
      label: 'New Arrivals',
      desc: 'Fresh styles just in this season',
      href: '/shop?sortBy=newest',
      badge: 'Fresh',
    },
    {
      label: 'Offers & Discounts',
      desc: 'Flat 15% Off with code WELCOME15',
      href: '/shop?discount=15',
      badge: '15% OFF',
    },
    {
      label: 'Customer Reviews & Ratings',
      desc: '4.9 ★ Verified ratings from 500+ happy buyers',
      href: '#customer-reviews',
      badge: '4.9 ★',
      isReviews: true,
    },
  ];

  const handleDrawerLinkClick = (href: string) => {
    setIsDrawerOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/70 shadow-xs select-none">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* ========================================================
                LEFT SIDE: 3-DASHED MENU (HAMBURGER) + LOGO
                (Strictly placed on the left as explicitly requested)
               ======================================================== */}
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
              {/* 3-Dashed Menu Button (Left-Side) */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="border-none p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#FAF7FD] hover:bg-[#EDE9FE] text-[#5B21B6] transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 group"
                aria-label="Open Categories & Menu"
                title="All Categories & Reviews Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B21B6] stroke-[2.3] group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Accurate CSM Logo with Footprints */}
              <CSMAnimatedLogo variant="navbar" />
            </div>

            {/* ========================================================
                RIGHT SIDE: SEARCH + WISHLIST + CART (Clean, Uncluttered Top Bar)
               ======================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">

              {/* Search Option */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="border-none p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-2xs"
                title="Search Footwear"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Wishlist Option */}
              <Link
                to="/wishlist"
                className="border-none relative p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all shadow-2xs"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart / WhatsApp Order Bag Option */}
              <button
                type="button"
                onClick={toggleCart}
                className="border-none relative p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-2xs"
                title="Shopping Bag / WhatsApp Order"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5B21B6] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          LEFT-SIDE 3-DASHED MENU SLIDE-OVER DRAWER
          (Contains ALL Categories Up to Reviews & Ratings)
         ======================================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Left Slide-in Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-purple-100 bg-gradient-to-r from-[#FAF7FD] to-white flex items-center justify-between">
              <CSMAnimatedLogo variant="drawer" />
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="border-none w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-slate-700 hover:text-[#5B21B6] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Owner WhatsApp Callout Banner */}
            <div className="p-3 sm:p-4 bg-[#F0FDF4] border-b border-emerald-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-900 leading-tight">
                    Chat Directly with Owner
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Discuss Price, Sizing & Immediate Delivery
                  </div>
                </div>
              </div>
              <a
                href={getWhatsAppGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0 shadow-xs"
              >
                Chat
              </a>
            </div>

            {/* Scrollable Categories List (Up to Reviews & Ratings) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 scrollbar-thin">
              <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-purple-900">
                All Departments & Categories
              </div>

              {DRAWER_CATEGORIES.map((cat) => {
                const isSelected =
                  location.pathname === cat.href ||
                  (cat.href.includes('?') && location.search.includes(cat.href.split('?')[1]));

                return (
                  <Link
                    key={cat.label}
                    to={cat.href}
                    onClick={() => handleDrawerLinkClick(cat.href)}
                    className={`group flex items-center justify-between p-3 rounded-2xl transition-all border-none ${
                      cat.isReviews
                        ? 'bg-[#FAF7FD] hover:bg-[#EDE9FE] ring-1 ring-purple-200 mt-2'
                        : isSelected
                        ? 'bg-[#EDE9FE] text-[#5B21B6] font-black'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {cat.isReviews ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 fill-current text-amber-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate group-hover:text-[#5B21B6] transition-colors">
                          {cat.label}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-normal">
                          {cat.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {cat.badge && (
                        <span
                          className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs ${
                            cat.isReviews
                              ? 'bg-amber-500 text-white'
                              : cat.highlight
                              ? 'bg-[#5B21B6] text-white'
                              : 'bg-purple-100 text-[#5B21B6]'
                          }`}
                        >
                          {cat.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#5B21B6] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer with Store Contact & Landmark */}
            <div className="p-4 border-t border-purple-100 bg-[#FAF7FD] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#5B21B6] font-bold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{STORE_LANDMARK}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-1">
                <a
                  href={`tel:${OWNER_PHONE}`}
                  className="flex items-center gap-1.5 font-bold hover:text-[#5B21B6] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#5B21B6]" />
                  <span>Call: {OWNER_PHONE}</span>
                </a>
                <span className="text-[10px] font-serif font-black text-[#5B21B6]">
                  పాదరక్షల బృందావనం
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
