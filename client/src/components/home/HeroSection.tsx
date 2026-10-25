import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Gem, Tag } from 'lucide-react';
import referenceHeroBanner from '../../assets/reference_hero_banner.jpg';

// 7 Quick Floating Category Navigation Pills directly under hero as seen in reference image
const QUICK_CATEGORIES = [
  {
    name: 'Heels',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17 L8 9 L15 9 L20 17 Z" />
        <path d="M4 17 L4 21" />
        <path d="M19 17 L21 21" />
      </svg>
    ),
    href: '/shop?category=women-heels',
  },
  {
    name: 'Sandals',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16 C 5 12, 19 12, 21 16" />
        <line x1="3" y1="18" x2="21" y2="18" />
        <path d="M8 12 L10 16" />
        <path d="M14 12 L16 16" />
      </svg>
    ),
    href: '/slippers',
  },
  {
    name: 'Sneakers',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16 C 3 13, 7 11, 12 11 C 17 11, 21 14, 21 17 L 3 17 Z" />
        <line x1="3" y1="19" x2="21" y2="19" />
        <line x1="8" y1="11" x2="9" y2="14" />
        <line x1="12" y1="11" x2="13" y2="14" />
      </svg>
    ),
    href: '/shop?category=running-shoes',
  },
  {
    name: 'Boots',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 L14 3 L14 14 L20 16 L20 20 L5 20 L5 16 L7 14 Z" />
        <line x1="7" y1="6" x2="14" y2="6" />
        <line x1="7" y1="9" x2="14" y2="9" />
      </svg>
    ),
    href: '/shop?category=boots',
  },
  {
    name: 'New Arrivals',
    icon: <ShoppingBag className="w-6 h-6" />,
    href: '/shop?sortBy=newest',
  },
  {
    name: 'Best Sellers',
    icon: <Gem className="w-6 h-6" />,
    href: '/shop?sortBy=best_selling',
  },
  {
    name: 'Sales',
    icon: <Tag className="w-6 h-6" />,
    href: '/shop?sortBy=discount_desc',
  },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-2 sm:pt-4 pb-6 sm:pb-10 select-none border-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Signature Arched Lavender Hero Banner Exactly from Reference */}
        <div className="relative rounded-3xl sm:rounded-[48px] overflow-hidden shadow-2xl border-none group">
          <img
            src={referenceHeroBanner}
            alt="Shoes That Define You - Chic styles, premium comfort and elegance in every step"
            className="w-full h-auto object-cover object-center block border-none select-none pointer-events-none"
          />

          {/* Interactive Clickable Hotspots overlaying the exact Reference Buttons */}
          {/* 1. SHOP NOW button overlay */}
          <Link
            to="/shop"
            className="absolute left-[6%] sm:left-[7.5%] bottom-[26%] sm:bottom-[29%] w-[22%] sm:w-[19%] h-[12%] sm:h-[6%] rounded-full cursor-pointer hover:bg-white/10 active:scale-95 transition-all z-10"
            title="Shop Now"
            aria-label="Shop Now"
          />

          {/* 2. watch video button overlay */}
          <a
            href="#video-reels"
            className="absolute left-[28%] sm:left-[27.5%] bottom-[26%] sm:bottom-[29%] w-[20%] sm:w-[16%] h-[12%] sm:h-[6%] rounded-full cursor-pointer hover:bg-white/10 active:scale-95 transition-all z-10"
            title="Watch Video Reels"
            aria-label="Watch Video Reels"
          />
        </div>

        {/* Floating Quick Category Navigation Strip */}
        <div className="max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-2 sm:px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none border-none">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group flex flex-col items-center justify-center gap-2 p-2 sm:p-3 rounded-2xl hover:bg-[#FAF7FD] transition-all shrink-0 min-w-[70px] sm:min-w-[85px] border-none"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F5F3FF] group-hover:bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center transition-all group-hover:scale-105 border-none">
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-[#5B21B6] transition-colors whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
