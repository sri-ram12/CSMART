import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../shop/BrandLogos';
import { COMPANY_BRANDS } from './CompanyBrandBanners';

interface TopBrandMarqueeProps {
  className?: string;
  onSelectBrand?: (brand: string) => void;
  currentBrand?: string;
}

export const TopBrandMarquee: React.FC<TopBrandMarqueeProps> = ({
  className = '',
  onSelectBrand,
  currentBrand,
}) => {
  const navigate = useNavigate();

  const handleBrandClick = (e: React.MouseEvent, brandName: string) => {
    e.preventDefault();
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else {
      navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
    }
  };

  const renderBrandPill = (b: (typeof COMPANY_BRANDS)[0], keyPrefix: string) => {
    const isActive = currentBrand?.toLowerCase() === b.name.toLowerCase();

    return (
      <button
        key={`${keyPrefix}-${b.id}`}
        type="button"
        onClick={(e) => handleBrandClick(e, b.name)}
        className={`group inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer shadow-2xs border ${
          isActive
            ? 'bg-[#5B21B6] text-white border-[#5B21B6] ring-2 ring-purple-300 shadow-sm'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-purple-300 hover:shadow-xs hover:scale-103'
        }`}
        title={`Shop ${b.name} Footwear Collection (${b.countText})`}
      >
        {/* Brand Logo Box */}
        <div className="w-5 h-5 rounded-md bg-slate-50 p-0.5 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-white transition-colors">
          <BrandLogo brand={b.name} variant="emblem" className="w-full h-full object-contain" />
        </div>

        {/* Brand Name */}
        <span className="font-serif tracking-tight text-slate-900 group-hover:text-[#5B21B6] transition-colors whitespace-nowrap">
          {b.name}
        </span>

        {/* Subtle count or check */}
        <span
          className={`text-[9.5px] font-mono font-black px-1.5 py-0.2 rounded-full ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-purple-50 text-[#7C3AED] border border-purple-200/50'
          }`}
        >
          {b.id === 'walkaroo' ? '381' : b.id === 'sparx' ? '174' : '✓'}
        </span>
      </button>
    );
  };

  return (
    <div
      aria-label="Official Footwear Brands Scrolling Ticker"
      className={`w-full bg-gradient-to-r from-purple-50/90 via-white to-purple-50/90 border-b border-purple-100/80 py-1.5 overflow-hidden select-none relative z-30 shadow-2xs ${className}`}
    >
      <div className="flex items-center">
        {/* Left Sticky/Fixed Tag on Desktop */}
        <div className="hidden md:flex items-center gap-1.5 pl-4 pr-3 py-0.5 bg-gradient-to-r from-purple-100/90 to-purple-50/60 rounded-r-full text-[#5B21B6] shrink-0 z-20 shadow-2xs border-r border-purple-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
            Authorized Brands
          </span>
        </div>

        {/* Continuous Smooth Scrolling Marquee Track */}
        <div className="relative flex-1 overflow-hidden">
          {/* Edge Fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-purple-50 via-purple-50/60 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-purple-50 via-purple-50/60 to-transparent z-10" />

          {/* Marquee Track: 2 Identical Halves for -50% Seamless Infinite Loop */}
          <div className="animate-brand-banners-scroll flex items-center hover:[animation-play-state:paused] cursor-pointer">
            <div className="flex items-center gap-3 shrink-0 pr-3">
              {COMPANY_BRANDS.map((b) => renderBrandPill(b, 'track-1'))}
            </div>
            <div className="flex items-center gap-3 shrink-0 pr-3" aria-hidden="true">
              {COMPANY_BRANDS.map((b) => renderBrandPill(b, 'track-2'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBrandMarquee;
