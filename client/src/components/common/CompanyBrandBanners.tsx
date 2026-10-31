import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ChevronRight, Store } from 'lucide-react';
import { BrandLogo } from '../shop/BrandLogos';

export interface CompanyBrandItem {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  countText: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
}

export const COMPANY_BRANDS: CompanyBrandItem[] = [
  {
    id: 'vkc-pride',
    name: 'VKC Pride',
    tagline: 'For Whole Family • Official Entrance Partner',
    badge: 'Authorized Partner',
    countText: 'Official Store Partner',
    bgGradient: 'from-[#991B1B] via-[#7F1D1D] to-[#5A1212]',
    accentColor: '#F59E0B',
    textColor: 'text-white',
    badgeBg: 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
  },
  {
    id: 'walkaroo',
    name: 'Walkaroo',
    tagline: 'Move On • Soft Cushion Comfort',
    badge: 'Top Brand',
    countText: 'Comfort Footwear',
    bgGradient: 'from-[#FF6B00] via-[#FF5500] to-[#D94000]',
    accentColor: '#FF6B00',
    textColor: 'text-white',
    badgeBg: 'bg-white/20 text-white',
  },
  {
    id: 'paragon',
    name: 'Paragon',
    tagline: "India's No. 1 PU Footwear Collection",
    badge: 'Authorized Brand',
    countText: 'Official Storefront Brand',
    bgGradient: 'from-[#DC2626] via-[#B91C1C] to-[#991B1B]',
    accentColor: '#FFFFFF',
    textColor: 'text-white',
    badgeBg: 'bg-white/20 text-white',
  },
  {
    id: 'walkmate',
    name: 'Walkmate',
    tagline: 'Everyday Steps • Reliable Comfort',
    badge: 'Authorized Brand',
    countText: 'Daily Wear Collection',
    bgGradient: 'from-[#065F46] via-[#047857] to-[#064E3B]',
    accentColor: '#6EE7B7',
    textColor: 'text-white',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30',
  },
  {
    id: 'sparx',
    name: 'Sparx',
    tagline: 'Go For It • Sports & Daily Wear',
    badge: 'Sports Brand',
    countText: 'Active Wear Collection',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0A0E17]',
    accentColor: '#EA580C',
    textColor: 'text-white',
    badgeBg: 'bg-amber-500/25 text-amber-300 border border-amber-400/40',
  },
  {
    id: 'striker',
    name: 'Striker',
    tagline: 'Strike Every Step • Bold & Strong',
    badge: 'Authorized Brand',
    countText: 'Sports & Casual',
    bgGradient: 'from-[#1D4ED8] via-[#2563EB] to-[#1E40AF]',
    accentColor: '#93C5FD',
    textColor: 'text-white',
    badgeBg: 'bg-blue-400/20 text-blue-100 border border-blue-300/30',
  },
  {
    id: 'brano',
    name: 'Brano',
    tagline: 'Step Up • Premium Quality Footwear',
    badge: 'Authorized Brand',
    countText: 'Premium Collection',
    bgGradient: 'from-[#4C1D95] via-[#5B21B6] to-[#3B0764]',
    accentColor: '#C4B5FD',
    textColor: 'text-white',
    badgeBg: 'bg-purple-400/20 text-purple-100 border border-purple-300/30',
  },
  {
    id: 'redfort',
    name: 'Redfort',
    tagline: 'Rooted in India • Durable Footwear',
    badge: 'Indian Brand',
    countText: 'Heritage Quality',
    bgGradient: 'from-[#B91C1C] via-[#991B1B] to-[#7F1D1D]',
    accentColor: '#FCA5A5',
    textColor: 'text-white',
    badgeBg: 'bg-red-400/20 text-red-100 border border-red-300/30',
  },
  {
    id: 'zaguaar',
    name: 'Zaguaar',
    tagline: 'Wild Comfort • Speed & Style',
    badge: 'Authorized Brand',
    countText: 'Speed Collection',
    bgGradient: 'from-[#0F766E] via-[#0D9488] to-[#115E59]',
    accentColor: '#5EEAD4',
    textColor: 'text-white',
    badgeBg: 'bg-teal-400/20 text-teal-100 border border-teal-300/30',
  },
  {
    id: 'hison',
    name: 'Hison',
    tagline: 'Crafted for Comfort • Everyday Wear',
    badge: 'Authorized Brand',
    countText: 'Comfort Collection',
    bgGradient: 'from-[#0369A1] via-[#0284C7] to-[#075985]',
    accentColor: '#38BDF8',
    textColor: 'text-white',
    badgeBg: 'bg-cyan-400/20 text-cyan-100 border border-cyan-300/30',
  },
  {
    id: 'poster-shoes',
    name: 'Poster Shoes',
    tagline: 'Bold Prints • Fashion Forward',
    badge: 'Fashion Brand',
    countText: 'Style Collection',
    bgGradient: 'from-[#831843] via-[#9D174D] to-[#6D1039]',
    accentColor: '#FBCFE8',
    textColor: 'text-white',
    badgeBg: 'bg-pink-400/20 text-pink-100 border border-pink-300/30',
  },
  {
    id: 'lancer',
    name: 'Lancer',
    tagline: 'Step in Style • Heavy Duty Sports',
    badge: 'Authorized Brand',
    countText: 'Durable Performance',
    bgGradient: 'from-[#1E3A5F] via-[#1D4ED8] to-[#1E3A5F]',
    accentColor: '#93C5FD',
    textColor: 'text-white',
    badgeBg: 'bg-blue-400/20 text-blue-100 border border-blue-300/30',
  },
  {
    id: 'jockey',
    name: 'Jockey',
    tagline: 'Premium Socks • Everyday Comfort',
    badge: 'Socks Only',
    countText: 'Socks Collection',
    bgGradient: 'from-[#374151] via-[#1F2937] to-[#111827]',
    accentColor: '#D1D5DB',
    textColor: 'text-white',
    badgeBg: 'bg-gray-400/20 text-gray-100 border border-gray-300/30',
  },
  {
    id: 'sushma',
    name: 'Sushma',
    tagline: "Ladies' Elegance • Graceful Steps",
    badge: 'Ladies Brand',
    countText: "Women's Collection",
    bgGradient: 'from-[#BE185D] via-[#DB2777] to-[#9D174D]',
    accentColor: '#FBCFE8',
    textColor: 'text-white',
    badgeBg: 'bg-pink-400/20 text-pink-100 border border-pink-300/30',
  },
  {
    id: 'tr-selections',
    name: 'TR Selections',
    tagline: "Ladies' Finest • Curated Style",
    badge: 'Ladies Brand',
    countText: "Women's Picks",
    bgGradient: 'from-[#7E22CE] via-[#9333EA] to-[#6B21A8]',
    accentColor: '#E9D5FF',
    textColor: 'text-white',
    badgeBg: 'bg-purple-400/20 text-purple-100 border border-purple-300/30',
  },
  {
    id: 'zm-selections',
    name: 'ZM Selections',
    tagline: "Ladies' Choice • Premium Comfort",
    badge: 'Ladies Brand',
    countText: "Women's Styles",
    bgGradient: 'from-[#C2410C] via-[#EA580C] to-[#9A3412]',
    accentColor: '#FED7AA',
    textColor: 'text-white',
    badgeBg: 'bg-orange-400/20 text-orange-100 border border-orange-300/30',
  },
  {
    id: 'airpistha',
    name: 'Airpistha',
    tagline: 'Air Cushion Comfort • Light as Air',
    badge: 'Authorized Brand',
    countText: 'Cloud Comfort',
    bgGradient: 'from-[#075985] via-[#0369A1] to-[#0C4A6E]',
    accentColor: '#BAE6FD',
    textColor: 'text-white',
    badgeBg: 'bg-sky-400/20 text-sky-100 border border-sky-300/30',
  },
  {
    id: 'doctor-choice',
    name: 'Doctor Choice',
    tagline: 'Medically Recommended • Foot Health',
    badge: 'Health Brand',
    countText: 'Ortho Collection',
    bgGradient: 'from-[#064E3B] via-[#065F46] to-[#047857]',
    accentColor: '#A7F3D0',
    textColor: 'text-white',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30',
  },
];

interface CompanyBrandBannersProps {
  currentBrand?: string;
  onSelectBrand?: (brand: string) => void;
  variant?: 'home' | 'shop';
}

export const CompanyBrandBanners: React.FC<CompanyBrandBannersProps> = ({
  currentBrand,
  onSelectBrand,
  variant = 'home',
}) => {
  const navigate = useNavigate();

  // Duplicated list for seamless infinite horizontal scrolling marquee
  const tickerBrands = [...COMPANY_BRANDS, ...COMPANY_BRANDS];

  const handleBrandClick = (e: React.MouseEvent, brandName: string) => {
    e.preventDefault();
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else {
      navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
    }
  };

  const renderBannerCard = (b: CompanyBrandItem, keyPrefix: string) => {
    const isActive = currentBrand?.toLowerCase() === b.name.toLowerCase();

    return (
      <div
        key={`${keyPrefix}-${b.id}`}
        onClick={(e) => handleBrandClick(e, b.name)}
        className={`group relative shrink-0 w-[280px] xs:w-80 sm:w-88 md:w-96 max-w-[86vw] rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br ${b.bgGradient} ${b.textColor} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border ${
          isActive
            ? 'ring-3 ring-[#7C3AED] ring-offset-2 scale-102 shadow-md'
            : 'border-white/10 hover:scale-102'
        }`}
      >
        {/* Background decorative subtle circles */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-12 -top-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Brand Logo Container (Prominent White Card with Brand Emblem) */}
            <div className="w-12 h-11 sm:w-16 sm:h-13 rounded-xl bg-white shadow-md flex items-center justify-center p-1 sm:p-1.5 shrink-0 border border-white/40 group-hover:scale-105 transition-transform duration-300">
              <BrandLogo brand={b.name} variant="emblem" className="w-full h-full object-contain" />
            </div>

            {/* Brand Name & Tagline */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="font-serif font-black text-base sm:text-xl tracking-tight leading-none drop-shadow-sm whitespace-nowrap">
                  {b.name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 fill-emerald-400/20 shrink-0" />
              </div>

              {/* Tagline */}
              <p className="text-[9.5px] sm:text-[11px] font-medium text-white/90 line-clamp-1">
                {b.tagline}
              </p>
            </div>
          </div>

          {/* Badge */}
          <span
            className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${b.badgeBg}`}
          >
            {b.badge}
          </span>
        </div>

        {/* Bottom Bar: Action callout */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px]">
          <span className="font-bold text-white/85 group-hover:text-white transition-colors flex items-center gap-1">
            <span>{b.countText}</span>
          </span>
          <span className="inline-flex items-center gap-1 font-black text-xs text-white group-hover:translate-x-1 transition-transform">
            <span>{isActive ? 'Selected' : 'Shop Brand'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  };

  const renderMiniPill = (b: CompanyBrandItem, keyPrefix: string) => {
    const isActive = currentBrand?.toLowerCase() === b.name.toLowerCase();

    return (
      <button
        key={`${keyPrefix}-${b.id}`}
        type="button"
        onClick={(e) => handleBrandClick(e, b.name)}
        className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full shadow-2xs text-xs font-extrabold shrink-0 transition-all hover:scale-105 cursor-pointer border ${
          isActive
            ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-md ring-2 ring-purple-300'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-purple-300'
        }`}
      >
        {/* Brand Emblem Mini Box */}
        <div className="w-6 h-5 flex items-center justify-center shrink-0">
          <BrandLogo brand={b.name} variant="emblem" className="w-full h-full object-contain" />
        </div>
        <span className="font-serif tracking-tight whitespace-nowrap">{b.name}</span>
        <span className="text-[10px] opacity-75 font-mono">
          {b.badge || '✓'}
        </span>
      </button>
    );
  };

  return (
    <section
      aria-label="Official Footwear Company Brands"
      className={`w-full select-none overflow-hidden ${
        variant === 'shop'
          ? 'py-3 bg-white border-b border-purple-100/80 mb-4'
          : 'py-6 sm:py-8 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-purple-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>Official Company Brand Banners</span>
              <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                Authorized Retailer
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500">
              Direct physical store inventory from VKC Pride, Walkaroo, Paragon, Sparx, Doctor Choice & authorized brands
            </p>
          </div>
        </div>

        {/* Quick link to view all */}
        <Link
          to="/shop"
          className="text-xs font-bold text-[#5B21B6] hover:text-[#4C1D95] flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>Explore All 560 Styles</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CONTINUOUS LOGO + NAME QUICK RIBBON (Smooth Infinite Scrolling Ticker) */}
      <div className="relative w-full overflow-hidden py-1 mb-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="animate-brand-banners-scroll flex items-center hover:[animation-play-state:paused]">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
            {COMPANY_BRANDS.map((b) => renderMiniPill(b, 'pill-half1'))}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4" aria-hidden="true">
            {COMPANY_BRANDS.map((b) => renderMiniPill(b, 'pill-half2'))}
          </div>
        </div>
      </div>

      {/* RICH BRAND CARDS MARQUEE (Displaying Logo Box + Brand Name + Tagline + Count) */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling Track */}
        <div className="animate-brand-banners-scroll flex items-center hover:[animation-play-state:paused]">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
            {COMPANY_BRANDS.map((b) => renderBannerCard(b, 'card-half1'))}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4" aria-hidden="true">
            {COMPANY_BRANDS.map((b) => renderBannerCard(b, 'card-half2'))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyBrandBanners;
