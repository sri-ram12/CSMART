import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, MessageCircle, Sparkles, Tag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getWhatsAppProductUrl } from '../../utils/whatsapp';

export interface BestSellerCatalogItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceINR: number;
  originalPriceINR: number;
  discountPercent: number;
  image: string;
  sku: string;
  colorName: string;
  rating: number;
  reviewsCount: number;
  catalogPage: number;
  shopUrl: string;
}

// 5 Authentic Best Sellers selected directly from the Chandhana Shoe Mart physical catalog (pdf1.pdf)
export const CATALOG_BEST_SELLERS: BestSellerCatalogItem[] = [
  {
    id: 'csm-sm871',
    name: "Sparx SM-871 Slip-On Running Shoes",
    brand: 'Sparx',
    category: 'Running Shoes',
    priceINR: 944,
    originalPriceINR: 1049,
    discountPercent: 10,
    image: '/catalog/sparx_sm_871_product.jpg',
    sku: 'SM-871',
    colorName: 'Grey / Yellow',
    rating: 4.9,
    reviewsCount: 142,
    catalogPage: 103,
    shopUrl: '/shop?brand=Sparx&search=SM871',
  },
  {
    id: 'csm-wlr74511',
    name: "Walkaroo WLR74511 Women's Comfort Slipper",
    brand: 'Walkaroo',
    category: 'Daily Slippers',
    priceINR: 265,
    originalPriceINR: 279,
    discountPercent: 5,
    image: '/catalog/walkaroo_wlr74511_product.jpg',
    sku: 'WLR74511',
    colorName: 'Peacock Blue',
    rating: 4.9,
    reviewsCount: 205,
    catalogPage: 301,
    shopUrl: '/shop?brand=Walkaroo&search=WLR74511',
  },
  {
    id: 'csm-ss103',
    name: "Sparx SS-103 Sport Floater Sandals",
    brand: 'Sparx',
    category: 'Floater Sandals',
    priceINR: 697,
    originalPriceINR: 775,
    discountPercent: 10,
    image: '/catalog/sparx_ss_103_product.jpg',
    sku: 'SS-103',
    colorName: 'Black / Grey',
    rating: 4.8,
    reviewsCount: 118,
    catalogPage: 88,
    shopUrl: '/shop?brand=Sparx&search=SS103',
  },
  {
    id: 'csm-bx1260',
    name: "Walkaroo BX1260 Cushion Sole Slipper",
    brand: 'Walkaroo',
    category: 'Cushion Slippers',
    priceINR: 233,
    originalPriceINR: 259.5,
    discountPercent: 10,
    image: '/catalog/walkaroo_bx1260_product.jpg',
    sku: 'BX1260',
    colorName: 'Olive',
    rating: 4.8,
    reviewsCount: 164,
    catalogPage: 245,
    shopUrl: '/shop?brand=Walkaroo&search=BX1260',
  },
  {
    id: 'csm-sm1036',
    name: "Sparx SM-1036 Athletic Pro Runner",
    brand: 'Sparx',
    category: 'Sports Shoes',
    priceINR: 944,
    originalPriceINR: 1049,
    discountPercent: 10,
    image: '/catalog/sparx_sm_1036_product.jpg',
    sku: 'SM-1036',
    colorName: 'Forest Green',
    rating: 4.9,
    reviewsCount: 96,
    catalogPage: 142,
    shopUrl: '/shop?brand=Sparx&search=SM1036',
  },
];

interface TrendingCarouselProps {
  products?: Product[];
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = () => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, item: BestSellerCatalogItem) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: item.id,
      title: item.name,
      sku: item.sku,
      size: 'UK 7',
      colorName: item.colorName,
      colorHex: '#6D28D9',
      imageUrl: item.image,
      unitPrice: item.priceINR,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent, item: BestSellerCatalogItem) => {
    e.preventDefault();
    e.stopPropagation();

    const productPayload: Product = {
      id: item.id,
      title: item.name,
      slug: item.id,
      description: item.name,
      price: item.priceINR,
      originalPrice: item.originalPriceINR,
      discountPercent: item.discountPercent,
      sku: item.sku,
      brand: item.brand,
      rating: item.rating,
      reviewCount: item.reviewsCount,
      categoryId: item.category.toLowerCase().replace(/\s+/g, '-'),
      department: 'SLIPPERS_SANDALS',
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isBestSeller: true,
      has3D: false,
      media: [{ id: `m-${item.id}`, productId: item.id, url: item.image, type: 'IMAGE', order: 0 }],
      variants: [],
    };

    toggleWishlist(productPayload);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-none select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title: 'BEST SELLERS' with Authenticity Subtitle */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5B21B6] text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Customer Favorites from Catalog</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider text-slate-900 uppercase">
            BEST SELLERS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
            Top-rated genuine footwear from our physical store catalog with verified manufacturer MRPs.
          </p>
        </div>

        {/* 5 Columns Displaying Authentic Footwear from the Scanned Catalog */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none snap-x px-1 sm:px-0">
          {CATALOG_BEST_SELLERS.map((item) => {
            const isFav = isInWishlist(item.id);
            const isAdded = addedIds[item.id];

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 p-2.5 sm:p-3 flex flex-col justify-between border border-purple-50 hover:border-purple-200/80 w-[165px] min-[390px]:w-[185px] sm:w-auto shrink-0 snap-start"
              >
                {/* Brand & Discount Badge at Top Left */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-2xs ${
                      item.brand === 'Sparx'
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#FF6B00] text-white'
                    }`}
                  >
                    {item.brand}
                  </span>
                  {item.discountPercent > 0 && (
                    <span className="text-[8.5px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.5 rounded-md shadow-2xs">
                      {item.discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Heart / Wishlist Button at Top Right */}
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, item)}
                  className={`absolute top-4 right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all border-none cursor-pointer ${
                    isFav
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-500 stroke-[1.8]'
                    }`}
                  />
                </button>

                {/* Catalog Footwear Image */}
                <Link
                  to={item.shopUrl}
                  className="block relative w-full aspect-square overflow-hidden rounded-xl bg-[#FAF7FD] mb-3 group-hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  {/* Subtle catalog page badge */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white">
                    Page {item.catalogPage}
                  </div>
                </Link>

                {/* Item Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.sku} • {item.colorName}
                    </div>

                    <Link
                      to={item.shopUrl}
                      className="block text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#5B21B6] transition-colors leading-snug line-clamp-2 mt-0.5"
                    >
                      {item.name}
                    </Link>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 pt-1 text-amber-400">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({item.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Price, WhatsApp Inquire & Lavender Cart Button */}
                  <div className="flex items-center justify-between pt-2 gap-1 border-t border-slate-100 mt-2">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="font-extrabold text-xs sm:text-base text-slate-900 tracking-tight">
                          ₹{item.priceINR.toLocaleString('en-IN')}
                        </span>
                        {item.originalPriceINR > item.priceINR && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{item.originalPriceINR.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Direct WhatsApp Inquire */}
                      <a
                        href={getWhatsAppProductUrl(item.name, item.priceINR, 'UK 7', item.colorName)}
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
                        onClick={(e) => handleAddToCart(e, item)}
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
