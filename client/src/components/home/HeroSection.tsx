import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  MessageCircle,
  ShoppingBag,
  Gem,
  Tag,
} from 'lucide-react';
import heroStudioShoes from '../../assets/hero_reference_shoes_studio.jpg';
import { getWhatsAppGeneralInquiryUrl } from '../../utils/whatsapp';

// 7 Quick Floating Category Navigation Pills directly under hero as seen in reference image
const QUICK_CATEGORIES = [
  {
    name: 'Heels',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 L14 3 L14 14 L20 16 L20 20 L5 20 L5 16 L7 14 Z" />
        <line x1="7" y1="6" x2="14" y2="6" />
        <line x1="7" y1="9" x2="14" y2="9" />
      </svg>
    ),
    href: '/shop?category=boots',
  },
  {
    name: 'New Arrivals',
    icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: '/shop?sortBy=newest',
  },
  {
    name: 'Best Sellers',
    icon: <Gem className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: '/shop?sortBy=best_selling',
  },
  {
    name: 'Sales',
    icon: <Tag className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: '/shop?sortBy=discount_desc',
  },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-2 sm:pt-4 pb-8 sm:pb-12 select-none border-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ========================================================
            TRUE RESPONSIVE LAVENDER ARCH STAGE
            (Buttons align accurately across mobile, tablet & desktop)
           ======================================================== */}
        <div className="relative rounded-3xl sm:rounded-[48px] bg-gradient-to-br from-[#E6D4FB] via-[#D8B4F8] to-[#C084FC] p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden border-none">
          {/* Subtle sunbeam shadow diagonals matching reference */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none select-none mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 20px, transparent 20px, transparent 65px)',
            }}
          />

          {/* Soft ambient lighting glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            {/* Left Column: Responsive Editorial Typography & Functional Buttons */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left py-2 sm:py-6">
              {/* Header Tag */}
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#2E1065] block">
                  STEP INTO CONFIDENCE
                </span>
              </div>

              {/* Main Headline: 'Shoes That Define you' */}
              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#1E0842] leading-[1.08]">
                  Shoes That <br />
                  <span className="font-serif italic font-normal text-[#3B0764]">
                    Define you
                  </span>
                </h1>

                {/* Subtitle from Reference */}
                <p className="text-xs sm:text-sm lg:text-base text-[#3B0764]/90 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  chic styles, premium comfort and elegance in every step.
                </p>
              </div>

              {/* RESPONSIVE BUTTONS ROW - EXACTLY MATCHING PINTEREST REFERENCE */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                {/* 1. Primary SHOP NOW Button */}
                <Link
                  to="/shop"
                  className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-7 sm:px-9 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all border-none cursor-pointer"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 text-purple-200" />
                </Link>

                {/* 2. watch video Button */}
                <a
                  href="#video-reels"
                  className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-[#2E1065] hover:text-[#5B21B6] transition-colors py-2 px-3 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-white text-[#5B21B6] flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <span>watch video</span>
                </a>
              </div>
            </div>

            {/* Right Column: Purple Studio Running Shoes with Arched Niche - Seamless */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="w-full max-w-md lg:max-w-none">
                <img
                  src={heroStudioShoes}
                  alt="Shoes That Define You"
                  className="w-full h-auto object-contain object-center rounded-2xl sm:rounded-3xl pointer-events-none select-none shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Category Navigation Strip */}
        <div className="max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-2 sm:px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none border-none">
            {QUICK_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-3 rounded-2xl hover:bg-[#FAF7FD] transition-all shrink-0 min-w-[65px] sm:min-w-[85px] border-none"
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#F5F3FF] group-hover:bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center transition-all group-hover:scale-105 border-none">
                  {cat.icon}
                </div>
                <span className="text-[10.5px] sm:text-xs font-bold text-slate-700 group-hover:text-[#5B21B6] transition-colors whitespace-nowrap">
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
