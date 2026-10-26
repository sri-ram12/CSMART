import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CSMAnimatedLogo } from '../common/CSMAnimatedLogo';
import { SelectCategoryModal } from '../category/SelectCategoryModal';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


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
          (Matches Picture 1 & Picture 2 layout strictly from left side)
         ======================================================== */}
      <SelectCategoryModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default Navbar;
