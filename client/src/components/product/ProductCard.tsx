import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Sparkles, Check, RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Quick3DModal } from './Quick3DModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const primaryMedia = product.media?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

  const defaultVariant = product.variants?.[0] || {
    id: `${product.id}-v0`,
    sku: product.sku,
    size: 'UK 8',
    colorName: 'Standard',
    colorHex: '#000000',
    inventory: 10,
    priceAdjustment: 0,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      sku: defaultVariant.sku,
      size: defaultVariant.size,
      colorName: defaultVariant.colorName,
      colorHex: defaultVariant.colorHex,
      imageUrl: primaryMedia,
      unitPrice: product.price,
      quantity: 1,
      availableStock: defaultVariant.inventory,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div className="group relative rounded-2xl sm:rounded-3xl bg-white shadow-card hover:shadow-card-hover overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 border-none">
        {/* Media Image Area */}
        <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50 block">
          {/* Main image with smooth zoom */}
          <img
            src={primaryMedia}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-1.5 items-start z-10">
            {product.discountPercent > 0 && (
              <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] uppercase px-2 sm:px-2.5 py-0.5 rounded-full shadow-md border-none">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.has3D && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3DModalOpen(true);
                }}
                className="bg-white/95 hover:bg-red-600 text-red-600 hover:text-white font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border-none transition-all cursor-pointer"
                title="Tap for 360° Interactive 3D View"
              >
                <Sparkles className="w-2.5 h-2.5" /> 360° View
              </button>
            )}
          </div>

          {/* Wishlist Button (BORDERLESS) */}
          <button
            onClick={handleWishlistClick}
            title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`border-none absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
              isFavorite
                ? 'bg-red-50 text-red-600'
                : 'bg-white/90 text-slate-600 hover:text-red-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current text-red-600' : ''}`} />
          </button>

          {/* Quick View overlay buttons (BORDERLESS) */}
          <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
            {product.has3D && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3DModalOpen(true);
                }}
                className="px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black bg-white/95 text-red-600 hover:bg-white transition-all shadow-md flex items-center justify-center gap-1 border-none cursor-pointer"
                title="View 360° 3D Model"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">360°</span>
              </button>
            )}
            <button
              onClick={handleQuickAdd}
              disabled={addedSuccess}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 border-none ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'btn-primary'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                </>
              )}
            </button>
          </div>
        </Link>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Brand & Department */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 mb-1">
            <span className="text-red-600 font-extrabold uppercase tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title & 360 Tag */}
          <div className="flex items-center justify-between gap-1">
            <Link to={`/product/${product.slug}`} className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>
            {product.has3D && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3DModalOpen(true);
                }}
                className="shrink-0 text-[9px] font-black text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-2 py-0.5 rounded-full flex items-center gap-0.5 border-none transition-all cursor-pointer"
                title="Tap for 360° View"
              >
                <RotateCcw className="w-2.5 h-2.5" /> 360°
              </button>
            )}
          </div>
        </div>

        {/* Pricing & Variants bar */}
        <div>
          {/* Color swatch previews */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2.5">
              {Array.from(new Set(product.variants.map((v) => v.colorHex))).slice(0, 4).map((hex, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-slate-200 inline-block shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
              {new Set(product.variants.map((v) => v.colorHex)).size > 4 && (
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  +{new Set(product.variants.map((v) => v.colorHex)).size - 4}
                </span>
              )}
            </div>
          )}

            {/* Price row */}
            <div className="flex items-center justify-between pt-1.5 sm:pt-2.5 border-t border-slate-100">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-lg font-black text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold hidden xs:inline">Free Delivery</span>
              </div>

              {/* Direct Touch-Friendly Quick Add Button on Mobile (Option Clearly Visible on All Devices) */}
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={addedSuccess}
                className={`sm:hidden border-none p-2 rounded-xl text-xs font-black transition-all shadow-sm flex items-center justify-center shrink-0 active:scale-90 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                title="Quick Add to Bag"
              >
                {addedSuccess ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              </button>
            </div>
        </div>
      </div>
    </div>

    {/* Quick 360° Interactive Modal */}
    <Quick3DModal
      product={product}
      isOpen={is3DModalOpen}
      onClose={() => setIs3DModalOpen(false)}
    />
  </>
);
};

export default ProductCard;
