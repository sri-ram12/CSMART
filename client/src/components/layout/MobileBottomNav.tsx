import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SelectCategoryModal } from '../category/SelectCategoryModal';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();
  const { user } = useAuth();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // If on Product Detail Page, the specialized sticky buy bar is active
  if (location.pathname.startsWith('/product/')) {
    return null;
  }

  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop';
  const isCategories = location.pathname === '/categories' || isCategoryModalOpen;
  const isAccount = location.pathname === '/profile' || location.pathname === '/login';

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* 1. Home */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all border-none ${
              isHome ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
            {isHome && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>

          {/* 2. Play / Explore */}
          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all border-none ${
              isShop ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Compass className={`w-5 h-5 ${isShop ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
            {isShop && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>

          {/* 3. Categories (Image 1 & Image 2 4-square grid tab) */}
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all border-none bg-transparent cursor-pointer ${
              isCategories ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 ${isCategories ? 'stroke-[2.5px] text-blue-600' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
            {isCategories && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </button>

          {/* 4. Account */}
          <Link
            to={user ? '/profile' : '/login'}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all border-none ${
              isAccount ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">Account</span>
            {isAccount && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>

          {/* 5. Cart */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all text-slate-500 hover:text-blue-600 font-medium border-none bg-transparent cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-2 text-slate-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center px-1 shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
          </button>
        </div>
      </nav>

      {/* Select Category Modal opened from bottom nav */}
      <SelectCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </>
  );
};

export default MobileBottomNav;
