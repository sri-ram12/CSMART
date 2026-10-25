import React from 'react';
import { Link } from 'react-router-dom';

interface CSMAnimatedLogoProps {
  variant?: 'navbar' | 'hero' | 'footer' | 'drawer';
  showTagline?: boolean;
  className?: string;
}

export const CSMAnimatedLogo: React.FC<CSMAnimatedLogoProps> = ({
  variant = 'navbar',
  showTagline = true,
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 sm:gap-2.5 group shrink-0 select-none ${className}`}
      title="Chandhana Shoe Mart - Step Into Perfection • Walk With Confidence"
    >
      {/* ========================================================
          ACCURATE FOOTPRINTS ICON CONTAINER
          (Realistic left and right soles with tread, 5 toes & beating heart)
         ======================================================== */}
      <div className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-[#FAF7FD] to-[#EDE9FE] shadow-sm ring-1 ring-purple-200/80 group-hover:ring-purple-400 group-hover:shadow-md transition-all duration-300 shrink-0">
        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
          {/* Left Footprint Sole */}
          <div className="animate-step-left">
            <svg
              viewBox="0 0 34 60"
              className="w-4 h-7 sm:w-5 sm:h-8 filter drop-shadow-xs"
              fill="none"
            >
              <defs>
                <linearGradient id="csmLeftFootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
              </defs>
              {/* Anatomical Left Sole Profile */}
              <path
                d="M17 12 C24 12, 29 17, 29 25 C29 32, 24 36, 20 40 C17 44, 17 48, 19 52 C20 56, 17 59, 12 59 C7 59, 5 54, 5 49 C5 42, 10 37, 11 31 C12 26, 10 20, 9 16 C8 13, 11 12, 17 12 Z"
                fill="url(#csmLeftFootGrad)"
              />
              {/* Soles Traction Grooves */}
              <path d="M12 21 Q17 19 22 21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M11 27 Q17 25 23 27" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M11 33 Q16 31 21 33" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M9 49 Q12 47 16 49" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M9 54 Q12 52 16 54" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

              {/* 5 Anatomical Toes */}
              <circle cx="18" cy="4" r="2.4" fill="#7C3AED" />
              <circle cx="12" cy="5.2" r="2.0" fill="#7C3AED" />
              <circle cx="7" cy="7.5" r="1.7" fill="#7C3AED" />
              <circle cx="3.5" cy="11" r="1.4" fill="#7C3AED" />
              <circle cx="1.5" cy="15" r="1.1" fill="#7C3AED" />
            </svg>
          </div>

          {/* Central Pulsing Heart (Quality First & Comfort) */}
          <div className="relative -mx-1 animate-heartbeat z-10">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Right Footprint Sole (Mirrored) */}
          <div className="animate-step-right">
            <svg
              viewBox="0 0 34 60"
              className="w-4 h-7 sm:w-5 sm:h-8 filter drop-shadow-xs scale-x-[-1]"
              fill="none"
            >
              <path
                d="M17 12 C24 12, 29 17, 29 25 C29 32, 24 36, 20 40 C17 44, 17 48, 19 52 C20 56, 17 59, 12 59 C7 59, 5 54, 5 49 C5 42, 10 37, 11 31 C12 26, 10 20, 9 16 C8 13, 11 12, 17 12 Z"
                fill="url(#csmLeftFootGrad)"
              />
              <path d="M12 21 Q17 19 22 21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M11 27 Q17 25 23 27" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M11 33 Q16 31 21 33" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M9 49 Q12 47 16 49" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
              <path d="M9 54 Q12 52 16 54" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

              <circle cx="18" cy="4" r="2.4" fill="#7C3AED" />
              <circle cx="12" cy="5.2" r="2.0" fill="#7C3AED" />
              <circle cx="7" cy="7.5" r="1.7" fill="#7C3AED" />
              <circle cx="3.5" cy="11" r="1.4" fill="#7C3AED" />
              <circle cx="1.5" cy="15" r="1.1" fill="#7C3AED" />
            </svg>
          </div>
        </div>

        {/* Small CSM Monogram Under Soles */}
        <div className="absolute -bottom-1.5 inset-x-0 flex justify-center">
          <span className="text-[7.5px] font-black uppercase tracking-wider bg-[#5B21B6] text-white px-1.5 py-0.2 rounded-full shadow-2xs scale-90">
            CSM
          </span>
        </div>
      </div>

      {/* ========================================================
          ACCURATE BRAND TYPOGRAPHY & POWERFUL SLOGAN
         ======================================================== */}
      <div className="flex flex-col min-w-0">
        {/* Row 1: Telugu Name & English Identity */}
        <div className="flex items-baseline gap-1 sm:gap-1.5 leading-tight flex-wrap">
          {/* Authentic Telugu: చందన షూమార్ట్ */}
          <span className="font-serif font-black text-xs sm:text-sm text-red-600 tracking-tight">
            చందన
          </span>
          <span className="font-serif font-black text-xs sm:text-sm text-[#5B21B6] tracking-tight">
            షూమార్ట్
          </span>

          <span className="text-slate-300 text-xs hidden min-[480px]:inline">•</span>

          {/* Clean English Brand Name */}
          <span className="font-sans font-black text-[10px] sm:text-xs text-slate-900 group-hover:text-[#5B21B6] tracking-wider uppercase transition-colors truncate">
            CHANDHANA SHOE MART
          </span>
        </div>

        {/* Row 2: Powerful Slogan & Heritage Tagline */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5 leading-none">
            {/* Heritage Telugu Pill */}
            <span className="text-[7.5px] sm:text-[8px] font-bold text-[#5B21B6] bg-[#EDE9FE] px-1.5 py-0.5 rounded font-serif shrink-0">
              పాదరక్షల బృందావనం
            </span>

            {/* Powerful Slogan Requested by User */}
            <span className="text-[8px] sm:text-[9.5px] font-semibold text-slate-600 italic tracking-tight hidden sm:inline truncate">
              Step Into Perfection • Walk With Confidence
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CSMAnimatedLogo;
