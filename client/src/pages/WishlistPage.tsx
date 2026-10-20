import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50/60">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm font-medium">
          Save your favorite running trainers, formal derbies, or CloudStep slides for later.
        </p>
        <Link to="/shop" className="btn-primary text-xs py-3.5 px-8 font-bold border-none shadow-md">
          Explore Footwear
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {wishlist.length} Footwear styles saved for purchase
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
