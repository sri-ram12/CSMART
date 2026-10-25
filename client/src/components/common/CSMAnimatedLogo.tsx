import React from 'react';
import { Link } from 'react-router-dom';

interface CSMAnimatedLogoProps {
  variant?: 'navbar' | 'hero' | 'footer' | 'badge';
  showTagline?: boolean;
  className?: string;
}

export const CSMAnimatedLogo: React.FC<CSMAnimatedLogoProps> = ({
  variant = 'navbar',
  showTagline = true,
  className = '',
}) => {
  // If variant is 'badge' or 'hero', render a self-contained circular emblem
  if (variant === 'badge' || variant === 'hero') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Animated Rotating Outer Ring */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full animate-[spin_24s_linear_infinite]"
          >
            <path
              id="badge-text-path-v2"
              d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
              fill="none"
            />
            <text className="text-[10px] font-black uppercase tracking-[0.24em] fill-[#5B21B6]">
              <textPath href="#badge-text-path-v2" startOffset="0%">
                ★ CHANDHANA SHOE MART ★ పాదరక్షల బృందావనం ★ QUALITY FIRST ★
              </textPath>
            </text>
          </svg>

          {/* Central Logo Plate with Stepping Twin Footprints & Pulsing Heart */}
          <div className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-br from-white via-purple-50 to-lavender-100/50 shadow-lg ring-1 ring-purple-300/40 flex flex-col items-center justify-center p-2.5">
            {/* Animated Twin Footprints with Tread */}
            <div className="relative flex items-center justify-center gap-1">
              {/* Left Footprint Sole */}
              <div className="animate-step-left">
                <svg viewBox="0 0 32 58" className="w-4 h-7 sm:w-5 sm:h-9 filter drop-shadow-sm">
                  <defs>
                    <linearGradient id="soleGradLeftBadgePurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#5B21B6" />
                    </linearGradient>
                  </defs>
                  {/* Outer Foot Silhouette */}
                  <path
                    d="M16 2 C22 2, 27 7, 27 16 C27 23, 23 28, 19 33 C16 37, 15 42, 17 48 C18 52, 15 56, 10 56 C5 56, 3 50, 4 44 C5 37, 9 32, 10 26 C12 21, 9 16, 8 11 C7 6, 10 2, 16 2 Z"
                    fill="url(#soleGradLeftBadgePurple)"
                  />
                  {/* Grip Tread Lines */}
                  <path d="M12 10 Q16 8 20 10" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M11 16 Q16 14 21 16" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M10 22 Q15 20 20 22" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M8 44 Q11 42 14 44" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M8 49 Q11 47 14 49" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  {/* 5 Toes */}
                  <circle cx="17" cy="1" r="1.8" fill="#7C3AED" />
                  <circle cx="12" cy="1.6" r="1.5" fill="#7C3AED" />
                  <circle cx="8" cy="3" r="1.3" fill="#7C3AED" />
                  <circle cx="5" cy="5.2" r="1.1" fill="#7C3AED" />
                  <circle cx="2.5" cy="8.2" r="0.9" fill="#7C3AED" />
                </svg>
              </div>

              {/* Pulsing Heart in Center */}
              <div className="relative z-10 -mx-1 animate-heartbeat">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Right Footprint Sole (Mirrored) */}
              <div className="animate-step-right">
                <svg viewBox="0 0 32 58" className="w-4 h-7 sm:w-5 sm:h-9 filter drop-shadow-sm scale-x-[-1]">
                  <path
                    d="M16 2 C22 2, 27 7, 27 16 C27 23, 23 28, 19 33 C16 37, 15 42, 17 48 C18 52, 15 56, 10 56 C5 56, 3 50, 4 44 C5 37, 9 32, 10 26 C12 21, 9 16, 8 11 C7 6, 10 2, 16 2 Z"
                    fill="url(#soleGradLeftBadgePurple)"
                  />
                  <path d="M12 10 Q16 8 20 10" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M11 16 Q16 14 21 16" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M10 22 Q15 20 20 22" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M8 44 Q11 42 14 44" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M8 49 Q11 47 14 49" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <circle cx="17" cy="1" r="1.8" fill="#7C3AED" />
                  <circle cx="12" cy="1.6" r="1.5" fill="#7C3AED" />
                  <circle cx="8" cy="3" r="1.3" fill="#7C3AED" />
                  <circle cx="5" cy="5.2" r="1.1" fill="#7C3AED" />
                  <circle cx="2.5" cy="8.2" r="0.9" fill="#7C3AED" />
                </svg>
              </div>
            </div>

            {/* CSM Monogram */}
            <div className="font-heading font-black italic tracking-tighter text-xs sm:text-sm text-[#5B21B6] mt-0.5 leading-none">
              CSM
            </div>
            <div className="text-[7.5px] sm:text-[8px] font-serif italic text-purple-900 font-bold leading-none mt-0.5">
              Quality First...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard brand lockup with highly effective animated footprints & powerful slogan
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 sm:gap-2.5 group shrink-0 select-none max-w-full ${className}`}
      title="Chandhana Shoe Mart - Step Into Perfection"
    >
      {/* Dynamic Animated Footprints Emblem Container */}
      <div className="relative flex items-center justify-center px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-purple-50/60 to-lavender-100/40 shadow-xs ring-1 ring-purple-100 group-hover:ring-purple-300 group-hover:shadow-md transition-all duration-300 shrink-0">
        {/* Animated Footprints Duo */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          {/* Left Footprint */}
          <div className="animate-step-left transition-transform">
            <svg viewBox="0 0 32 58" className="w-3.5 h-6 sm:w-4 sm:h-7 filter drop-shadow-xs">
              <defs>
                <linearGradient id="navSoleGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
              </defs>
              {/* Ergonomic Foot Sole Profile */}
              <path
                d="M16 2 C22 2, 27 7, 27 16 C27 23, 23 28, 19 33 C16 37, 15 42, 17 48 C18 52, 15 56, 10 56 C5 56, 3 50, 4 44 C5 37, 9 32, 10 26 C12 21, 9 16, 8 11 C7 6, 10 2, 16 2 Z"
                fill="url(#navSoleGradPurple)"
              />
              {/* Traction Tread Marks */}
              <path d="M12 11 Q16 9 20 11" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M11 17 Q16 15 21 17" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M10 23 Q15 21 20 23" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M8 44 Q11 42 14 44" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M8 49 Q11 47 14 49" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              {/* 5 Distinct Anatomical Toes */}
              <circle cx="17" cy="1" r="1.8" fill="#7C3AED" />
              <circle cx="12" cy="1.6" r="1.5" fill="#7C3AED" />
              <circle cx="8" cy="3" r="1.3" fill="#7C3AED" />
              <circle cx="5" cy="5.2" r="1.1" fill="#7C3AED" />
              <circle cx="2.5" cy="8.2" r="0.9" fill="#7C3AED" />
            </svg>
          </div>

          {/* Glowing Beating Heart Centerpiece */}
          <div className="relative -mx-1 animate-heartbeat z-10">
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-600 drop-shadow-[0_0_6px_rgba(225,29,72,0.7)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Right Footprint (Mirrored) */}
          <div className="animate-step-right transition-transform">
            <svg viewBox="0 0 32 58" className="w-3.5 h-6 sm:w-4 sm:h-7 filter drop-shadow-xs scale-x-[-1]">
              <path
                d="M16 2 C22 2, 27 7, 27 16 C27 23, 23 28, 19 33 C16 37, 15 42, 17 48 C18 52, 15 56, 10 56 C5 56, 3 50, 4 44 C5 37, 9 32, 10 26 C12 21, 9 16, 8 11 C7 6, 10 2, 16 2 Z"
                fill="url(#navSoleGradPurple)"
              />
              <path d="M12 11 Q16 9 20 11" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M11 17 Q16 15 21 17" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M10 23 Q15 21 20 23" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M8 44 Q11 42 14 44" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <path d="M8 49 Q11 47 14 49" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
              <circle cx="17" cy="1" r="1.8" fill="#7C3AED" />
              <circle cx="12" cy="1.6" r="1.5" fill="#7C3AED" />
              <circle cx="8" cy="3" r="1.3" fill="#7C3AED" />
              <circle cx="5" cy="5.2" r="1.1" fill="#7C3AED" />
              <circle cx="2.5" cy="8.2" r="0.9" fill="#7C3AED" />
            </svg>
          </div>
        </div>

        {/* CSM Monogram Stack */}
        <div className="flex flex-col ml-1 sm:ml-1.5 leading-none">
          <span className="font-heading font-black italic tracking-tighter text-xs sm:text-sm text-[#5B21B6]">
            CSM
          </span>
          <span className="text-[6.5px] sm:text-[7.5px] font-serif italic text-purple-900 font-bold leading-none mt-0.5 whitespace-nowrap">
            Quality First...
          </span>
        </div>
      </div>

      {/* Typography: Telugu Brand, English Name & Powerful Slogan */}
      <div className="flex flex-col min-w-0">
        {/* Brand Name Row: Telugu + English */}
        <div className="flex items-baseline gap-1.5 leading-tight">
          {/* Authentic Telugu: చందన (Red) షూమార్ట్ (Royal Purple) */}
          <div className="flex items-baseline gap-0.5">
            <span className="font-black text-sm sm:text-base text-red-600 font-serif drop-shadow-xs">
              చందన
            </span>
            <span className="font-black text-sm sm:text-base text-[#5B21B6] font-serif drop-shadow-xs">
              షూమార్ట్
            </span>
          </div>

          {/* Subtitle Separator */}
          <span className="text-slate-300 text-xs hidden sm:inline">•</span>

          {/* English Identity */}
          <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.16em] font-black text-slate-900 group-hover:text-[#5B21B6] transition-colors hidden sm:inline truncate">
            CHANDHANA SHOE MART
          </span>
        </div>

        {/* POWERFUL SLOGAN WITHIN / BELOW LOGO */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5 leading-none flex-wrap">
            {/* Authentic Heritage Tagline Pill */}
            <span className="text-[7.5px] sm:text-[8.5px] font-bold text-[#5B21B6] tracking-wider bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-purple-200/60 leading-none">
              పాదరక్షల బృందావనం
            </span>

            {/* Powerful Slogan */}
            <span className="text-[8px] sm:text-[9.5px] font-bold text-slate-700 italic tracking-tight leading-none hidden md:inline">
              Step Into Perfection • Walk With Confidence
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CSMAnimatedLogo;
