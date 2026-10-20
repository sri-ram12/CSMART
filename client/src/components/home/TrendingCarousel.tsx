import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingCarouselProps {
  products: Product[];
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller' | '3d'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'bestseller') return p.isBestSeller;
    if (activeTab === '3d') return p.has3D;
    return true;
  });

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with BORDERLESS Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Footwear Showcase
            </h2>
          </div>

          {/* Borderless Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`border-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-white'
              }`}
            >
              All Trending
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`border-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'new'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-white'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`border-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-white'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`border-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === '3d'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-red-500" />
              <span>3D Models</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA (BORDERLESS) */}
        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-secondary text-xs font-bold py-3.5 px-8 inline-flex items-center gap-2">
            <span>Explore All 20+ Styles in Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
