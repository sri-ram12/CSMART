import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getWhatsAppProductUrl } from '../../utils/whatsapp';

import bootPink from '../../assets/boot_pink.jpg';
import bootPurple from '../../assets/boot_purple.jpg';
import bootRed from '../../assets/boot_red.jpg';
import bootBeige from '../../assets/boot_beige.jpg';
import bootBrown from '../../assets/boot_brown.jpg';

interface BootItem {
  id: string;
  name: string;
  priceUSD: string;
  priceINR: number;
  image: string;
  sku: string;
  colorName: string;
}

// Exactly the 5 items shown in the reference image (Mea's Shoelle reference)
const REFERENCE_BOOTS: BootItem[] = [
  {
    id: 'boot-pink-fur',
    name: 'Pink Fur-Lined Winter Boot',
    priceUSD: '$59.99',
    priceINR: 2499,
    image: bootPink,
    sku: 'BOOT-PNK-01',
    colorName: 'Blush Pink',
  },
  {
    id: 'boot-purple-fur',
    name: 'Puple Fur-Lined Winter Boot',
    priceUSD: '$49.99',
    priceINR: 1999,
    image: bootPurple,
    sku: 'BOOT-PRP-02',
    colorName: 'Lilac Purple',
  },
  {
    id: 'boot-red-fur',
    name: 'Red Fur-Lined Winter Boot',
    priceUSD: '$44.99',
    priceINR: 1899,
    image: bootRed,
    sku: 'BOOT-RED-03',
    colorName: 'Ruby Red',
  },
  {
    id: 'boot-beige-fur',
    name: 'Beige Fur-Lined Winter Boot',
    priceUSD: '$69.99',
    priceINR: 2899,
    image: bootBeige,
    sku: 'BOOT-BGE-04',
    colorName: 'Cozy Beige',
  },
  {
    id: 'boot-brown-fur',
    name: 'Brown Fur-Lined Winter Boot',
    priceUSD: '$54.99',
    priceINR: 2299,
    image: bootBrown,
    sku: 'BOOT-BRN-05',
    colorName: 'Warm Brown',
  },
];

interface TrendingCarouselProps {
  products?: Product[];
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = () => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, item: BootItem) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: item.id,
      title: item.name,
      sku: item.sku,
      size: 'UK 7',
      colorName: item.colorName,
      colorHex: '#C084FC',
      imageUrl: item.image,
      unitPrice: item.priceINR,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent, item: BootItem) => {
    e.preventDefault();
    e.stopPropagation();

    const productPayload: Product = {
      id: item.id,
      title: item.name,
      slug: item.id,
      description: item.name,
      price: item.priceINR,
      discountPercent: 0,
      sku: item.sku,
      brand: 'Chandhana Curated',
      rating: 5,
      reviewCount: 42,
      categoryId: 'boots',
      department: 'WOMEN',
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isBestSeller: true,
      has3D: false,
      media: [{ id: '1', productId: item.id, url: item.image, type: 'IMAGE', order: 0 }],
      variants: [],
    };

    toggleWishlist(productPayload);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-none select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title from Reference: 'BEST SELLERS' in Elegant Serif */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider text-slate-900 uppercase">
            BEST SELLERS
          </h2>
        </div>

        {/* Exactly 5 Columns Matching Reference Image (Swipable on mobile, 5 columns on desktop) */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none snap-x px-1 sm:px-0">
          {REFERENCE_BOOTS.map((boot) => {
            const isFav = isInWishlist(boot.id);
            const isAdded = addedIds[boot.id];

            return (
              <div
                key={boot.id}
                className="group relative bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between border-none w-[155px] min-[390px]:w-[175px] sm:w-auto shrink-0 snap-start"
              >
                {/* Heart / Wishlist Button at Top Right */}
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, boot)}
                  className={`absolute top-4 right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${
                    isFav
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-500 stroke-[1.8]'
                    }`}
                  />
                </button>

                {/* Boot Image */}
                <Link
                  to="/shop?category=boots"
                  className="block relative w-full aspect-square overflow-hidden rounded-xl bg-[#FAF7FD] mb-3 group-hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={boot.image}
                    alt={boot.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </Link>

                {/* Boot Details Matching Reference Layout */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to="/shop?category=boots"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#5B21B6] transition-colors leading-snug line-clamp-2"
                    >
                      {boot.name}
                    </Link>

                    {/* 5 Yellow Stars */}
                    <div className="flex items-center gap-0.5 pt-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Price, WhatsApp Inquire & Lavender Cart Button */}
                  <div className="flex items-center justify-between pt-2 gap-1">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">
                      {boot.priceUSD}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Direct WhatsApp Inquire */}
                      <a
                        href={getWhatsAppProductUrl(boot.name, boot.priceINR, 'UK 7', boot.colorName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all duration-300 shadow-2xs border-none cursor-pointer"
                        title="Chat & Inquire on WhatsApp (9553536884)"
                        aria-label="Inquire Price on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                      </a>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, boot)}
                        className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border-none cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#EDE9FE] hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white'
                        }`}
                        aria-label="Add to cart"
                        title="Add to Cart"
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 text-white stroke-[2.5]" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
