import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CSMAnimatedLogo } from '../common/CSMAnimatedLogo';
import { SelectCategoryModal } from '../category/SelectCategoryModal';
import { ShareQRModal } from '../common/ShareQRModal';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);


  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/70 shadow-xs select-none">
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-20 gap-2 sm:gap-4">
            {/* ========================================================
                LEFT SIDE: 3-DASHED MENU (HAMBURGER) + LOGO & BRAND
                (Strictly placed on the left, contained inside viewport bounds)
               ======================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden">
              {/* 3-Dashed Menu Button (Left-Side) */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="border-none p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#FAF7FD] hover:bg-[#EDE9FE] text-[#5B21B6] transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 active:scale-95 group"
                aria-label="Open Categories & Menu"
                title="All Categories & Reviews Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B21B6] stroke-[2.3] group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Accurate CSM Logo with Footprints */}
              <CSMAnimatedLogo variant="navbar" />
            </div>

            {/* ========================================================
                RIGHT SIDE: SEARCH + WISHLIST + CART (Clean Customer Toolbar)
               ======================================================== */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 ml-auto pl-1">
              {/* Install PWA App Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-[#5B21B6] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-2xs hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                title="Install Chandhana Shoe Mart WebApp"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Install App</span>
              </button>

              {/* QR Code Storefront Share Option */}
              <button
                type="button"
                onClick={() => setIsQROpen(true)}
                className="border-none p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="Scan & Share Store QR Code"
                aria-label="Store QR Code"
              >
                <QrCode className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Search Option */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="border-none p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="Search Footwear"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Wishlist Option */}
              <Link
                to="/wishlist"
                className="border-none relative p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all shadow-2xs hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
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
                className="border-none relative p-2 sm:p-2.5 rounded-full text-[#5B21B6] bg-[#FAF7FD] hover:bg-[#EDE9FE] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
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
          (Matches Picture 1 & Picture 2 layout strictly from left side)
         ======================================================== */}
      <SelectCategoryModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* QR Code Storefront Share Modal */}
      <ShareQRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />
    </>
  );
};

export default Navbar;
