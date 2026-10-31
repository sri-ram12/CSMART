import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { api } from '../../services/api';
import { Sparkles, ArrowRight, Share2, Tag, Eye } from 'lucide-react';
import { BrandLogo } from '../shop/BrandLogos';
import { ProductShareModal } from '../admin/ProductShareModal';

export const NewArrivalsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductForShare, setSelectedProductForShare] = useState<Product | null>(null);

  useEffect(() => {
    api.products
      .getNewArrivals()
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        console.error('Failed to load new arrivals:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-purple-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-purple-100/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Fresh In Store
              </span>
              <span className="text-xs font-bold text-[#5B21B6] bg-purple-100/70 px-2 py-0.5 rounded-full">
                {products.length} New Releases
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              New Footwear Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Newly launched genuine styles directly from authorized manufacturer catalogs
            </p>
          </div>

          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#5B21B6] hover:text-[#4C1D95] transition-colors self-start sm:self-auto group"
          >
            <span>View All New Styles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {products.slice(0, 8).map((product) => {
              const image =
                product.media?.[0]?.url ||
                product.variants?.[0]?.imageUrl ||
                '/shop/shoe_placeholder.png';

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl border border-purple-100/80 hover:border-purple-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-[#5B21B6] text-white text-[10px] font-black uppercase tracking-wider shadow-xs pointer-events-auto">
                      {product.brand}
                    </span>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProductForShare(product);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#5B21B6] shadow-sm transition pointer-events-auto cursor-pointer"
                      title="Share Product with Friends or on WhatsApp"
                      aria-label="Share product"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product Image Link */}
                  <Link
                    to={`/product/${product.slug}`}
                    className="relative block pt-[80%] bg-gradient-to-b from-purple-50/30 to-white overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>

                  {/* Product Meta */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {product.department} • {product.category?.name || 'Footwear'}
                    </div>

                    <Link
                      to={`/product/${product.slug}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#5B21B6] transition-colors line-clamp-2 leading-snug mb-2"
                      title={product.title}
                    >
                      {product.title}
                    </Link>

                    {/* Price and Action */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/product/${product.slug}`}
                        className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-purple-50 hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ProductShareModal
        product={selectedProductForShare}
        isOpen={Boolean(selectedProductForShare)}
        onClose={() => setSelectedProductForShare(null)}
      />
    </section>
  );
};

export default NewArrivalsSection;

