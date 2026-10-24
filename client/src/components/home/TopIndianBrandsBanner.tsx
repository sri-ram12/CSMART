import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { BrandLogo } from '../shop/BrandLogos';

export interface BrandBannerItem {
  name: string;
  queryParam: string;
  badge: string;
  tagline: string;
  offerText: string;
  badgeColor: string;
  logoBg?: string;
}

export const TOP_BRANDED_BANNERS: BrandBannerItem[] = [
  {
    name: 'Nike',
    queryParam: 'Nike',
    badge: 'Global #1',
    tagline: 'Pegasus & Flex Runner',
    offerText: 'Min 25% Off',
    badgeColor: 'bg-slate-900 text-white',
  },
  {
    name: 'Puma',
    queryParam: 'Puma',
    badge: 'Trending',
    tagline: 'Rebound & Carina Kicks',
    offerText: 'Special Price',
    badgeColor: 'bg-red-600 text-white',
  },
  {
    name: 'Adidas',
    queryParam: 'Adidas',
    badge: '3-Stripes',
    tagline: 'Cloudfoam & Court Classic',
    offerText: 'Top Selling',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    name: 'Skechers',
    queryParam: 'Skechers',
    badge: 'Arch Fit',
    tagline: 'Go Walk Max Cushion',
    offerText: 'Comfort Tech',
    badgeColor: 'bg-sky-600 text-white',
  },
  {
    name: 'Crocs',
    queryParam: 'Crocs',
    badge: 'Original Clogs',
    tagline: 'All-Terrain & Platform',
    offerText: 'Best Seller',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    name: 'Red Tape',
    queryParam: 'Red Tape',
    badge: 'Flat 50% Off',
    tagline: 'Casual Loafers & Kicks',
    offerText: 'Hot Deal',
    badgeColor: 'bg-rose-600 text-white',
  },
  {
    name: 'Woodland',
    queryParam: 'Woodland',
    badge: 'Pure Leather',
    tagline: 'Heavy-Duty Trekker Boots',
    offerText: 'Rugged Tough',
    badgeColor: 'bg-amber-800 text-white',
  },
  {
    name: 'Bata',
    queryParam: 'Bata',
    badge: 'Since 1931',
    tagline: 'Derby Formals & Comfit',
    offerText: 'Heritage Trust',
    badgeColor: 'bg-red-700 text-white',
  },
  {
    name: 'Asics',
    queryParam: 'Asics',
    badge: 'Gel Cushion',
    tagline: 'Gel-Kayano Stability Run',
    offerText: 'Pro Runners',
    badgeColor: 'bg-indigo-700 text-white',
  },
  {
    name: 'Campus',
    queryParam: 'Campus',
    badge: 'Youth Kicks',
    tagline: 'Hurricane & Turbo LED',
    offerText: 'Under ₹1,999',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    name: 'HRX by Hrithik Roshan',
    queryParam: 'HRX',
    badge: 'Fitness Tech',
    tagline: 'Engineered Performance',
    offerText: 'Active Drop',
    badgeColor: 'bg-zinc-800 text-white',
  },
  {
    name: 'Reebok',
    queryParam: 'Reebok',
    badge: 'Vector Power',
    tagline: 'Retro Classic Athletic',
    offerText: 'Min 30% Off',
    badgeColor: 'bg-slate-800 text-white',
  },
  {
    name: 'Sparx',
    queryParam: 'Sparx',
    badge: 'Action Sports',
    tagline: 'Power Floater Sandals',
    offerText: 'All-Weather',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    name: 'Relaxo',
    queryParam: 'Relaxo',
    badge: 'Titan #1',
    tagline: 'Bahamas Soft Slides',
    offerText: 'Daily Comfort',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    name: 'Red Chief',
    queryParam: 'Red Chief',
    badge: '100% Leather',
    tagline: 'Tough Outdoor Trekker',
    offerText: 'Handcrafted',
    badgeColor: 'bg-red-800 text-white',
  },
  {
    name: 'Metro',
    queryParam: 'Metro',
    badge: 'Royal Festive',
    tagline: 'Wedding & Block Heels',
    offerText: 'Celebrations',
    badgeColor: 'bg-purple-700 text-white',
  },
];

export const TopIndianBrandsBanner: React.FC = () => {
  // Duplicate for seamless continuous looping marquee
  const duplicatedBanners = [...TOP_BRANDED_BANNERS, ...TOP_BRANDED_BANNERS];

  return (
    <section
      aria-label="Top Branded Footwear Banners"
      className="relative w-full bg-slate-900 text-white overflow-hidden select-none border-b border-slate-800 shadow-md"
    >
      {/* Top Header Strip with Brand Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="font-black uppercase tracking-wider text-white text-[11px] sm:text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Branded Footwear Stores</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px]">
            Official Partner Banners
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Authentic Genuine Warranty</span>
          </div>
          <Link
            to="/shop"
            className="text-blue-400 hover:text-blue-300 font-black text-xs flex items-center gap-1 transition-colors border-none"
          >
            <span>View All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Scrolling Marquee Ribbon of Named Brand Banners */}
      <div className="relative overflow-hidden py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        {/* Left & Right Gradient Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10" />

        {/* Continuous Marquee Track (Pauses on Hover for Easy Tapping) */}
        <div className="animate-marquee flex items-center gap-3 sm:gap-4">
          {duplicatedBanners.map((brand, idx) => (
            <Link
              key={`${brand.name}-${idx}`}
              to={`/shop?brand=${encodeURIComponent(brand.queryParam)}`}
              className="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-900 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 border-none shrink-0 w-64 sm:w-72"
            >
              {/* Brand Logo Container */}
              <div className="w-14 sm:w-16 h-11 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:bg-blue-50/40 transition-all shrink-0">
                <BrandLogo brand={brand.name} className="max-h-7 max-w-full text-slate-900" />
              </div>

              {/* Named Banner Details */}
              <div className="flex-1 min-w-0 flex flex-col text-left">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">
                    {brand.name}
                  </span>
                  <span
                    className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0 shadow-2xs ${brand.badgeColor}`}
                  >
                    {brand.badge}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 font-medium truncate group-hover:text-slate-700">
                  {brand.tagline}
                </span>

                <div className="mt-1 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-rose-600 font-extrabold flex items-center gap-0.5">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{brand.offerText}</span>
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Shop</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopIndianBrandsBanner;
