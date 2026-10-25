import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Sparkles, Check, RotateCcw, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getWhatsAppProductUrl } from '../../utils/whatsapp';
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
    id: undefined,
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
      unitPrice: product.price + (defaultVariant.priceAdjustment || 0),
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
      <div className="group relative rounded-2xl sm:rounded-3xl bg-white shadow-sm hover:shadow-xl hover:shadow-purple-900/10 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 border border-purple-100/60">
        {/* Media Image Area with Soft Pastel Background */}
        <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#FAF7FD] block">
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
              <span className="bg-[#5B21B6] text-white font-black text-[9px] sm:text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md border-none tracking-wider">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.has3D !== false && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIs3DModalOpen(true);
                }}
                className="bg-[#EDE9FE] hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border-none transition-all cursor-pointer"
                title="Tap for 360° Interactive 3D View"
              >
                <Sparkles className="w-2.5 h-2.5" /> 360°
              </button>
            )}
          </div>

          {/* Wishlist Heart Icon Button (Matching reference image top-right position) */}
          <button
            onClick={handleWishlistClick}
            title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`border-none absolute top-2 sm:top-3 right-2 sm:right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                : 'bg-white/90 text-slate-400 hover:text-[#5B21B6] hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-600' : ''}`} />
          </button>
        </Link>

        {/* Product Content Details */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {/* Title */}
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#5B21B6] transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>

            {/* 5-Star Rating (Matching reference image yellow stars) */}
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              <div className="flex items-center text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold ml-0.5">
                ({product.reviewCount || 12})
              </span>
            </div>
          </div>

          {/* Price & Reference Circular Cart Action Button */}
          <div className="flex items-center justify-between pt-2 border-t border-purple-50">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-serif font-black text-[#1E0842]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* WhatsApp Price Inquiry */}
              <a
                href={getWhatsAppProductUrl(product.title, product.price, defaultVariant.size, defaultVariant.colorName)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="border-none w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all duration-300 shadow-2xs cursor-pointer active:scale-90"
                title="Inquire Price with Owner on WhatsApp"
                aria-label="Inquire Price on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              </a>

              {/* Circular Purple Cart Icon Button */}
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={addedSuccess}
                className={`border-none w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center shrink-0 cursor-pointer active:scale-90 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#EDE9FE] hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white'
                }`}
                title="Add to Shopping Bag"
              >
                {addedSuccess ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
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
