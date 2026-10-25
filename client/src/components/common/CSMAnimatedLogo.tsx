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
          CIRCULAR LOGO BORDER WITH ANATOMICALLY CORRECT FOOTPRINTS
          (Circular shape border, correct left/right footprint soles, 5 toes & heart)
         ======================================================== */}
      <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-[#7C3AED] ring-2 ring-purple-100 bg-gradient-to-b from-white via-[#FAF7FD] to-[#F3E8FF] shadow-xs flex items-center justify-center p-1 shrink-0 group-hover:scale-105 group-hover:border-[#6D28D9] group-hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          {/* ===================================================
              LEFT FOOTPRINT
              - Big toe on the INSIDE (right side of left foot)
              - 4 other toes cascading downward to the left (lateral)
              - Arch indentation on the INSIDE (right side)
              - Lateral smooth edge on the LEFT
             =================================================== */}
          <div className="animate-step-left">
            <svg
              viewBox="0 0 28 50"
              className="w-3.5 h-6 sm:w-4 sm:h-7 filter drop-shadow-xs"
              fill="none"
            >
              <defs>
                <linearGradient id="csmFootGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
              </defs>

              {/* Anatomical Left Sole: Lateral curve on left, deep inner arch on right */}
              <path
                d="M 14 47
                   C 10 47, 7 44, 7 39
                   C 7 33, 8 28, 8 23
                   C 8 18, 7 15, 10 13
                   C 13 11, 18 11, 21 13
                   C 23 15, 23 19, 21 23
                   C 18 27, 14 30, 14 34
                   C 14 38, 17 41, 17 44
                   C 17 47, 15 47, 14 47 Z"
                fill="url(#csmFootGradLeft)"
              />

              {/* Sole Grip Traction Lines */}
              <path d="M 10 17 Q 15 15 19 17" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 10 22 Q 15 20 18 22" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 9 39 Q 13 37 16 39" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 10 43 Q 13 41 15 43" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />

              {/* 5 Anatomical Left Toes (Big toe inside at right, decreasing to pinky on left) */}
              <ellipse cx="19" cy="5.5" rx="2.8" ry="3.6" fill="#7C3AED" />
              <ellipse cx="14" cy="6.2" rx="2.2" ry="2.8" fill="#7C3AED" />
              <ellipse cx="9.8" cy="8.0" rx="1.8" ry="2.3" fill="#7C3AED" />
              <ellipse cx="6.4" cy="10.8" rx="1.5" ry="1.9" fill="#7C3AED" />
              <ellipse cx="3.8" cy="14.2" rx="1.2" ry="1.5" fill="#7C3AED" />
            </svg>
          </div>

          {/* Central Pulsing Heart (Symbolizing Footwear Care & Comfort) */}
          <div className="relative -mx-0.5 animate-heartbeat z-10">
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* ===================================================
              RIGHT FOOTPRINT (Mirrored)
              - Big toe on the INSIDE (left side of right foot)
              - 4 other toes cascading downward to the right (lateral)
              - Arch indentation on the INSIDE (left side)
              - Lateral smooth edge on the RIGHT
             =================================================== */}
          <div className="animate-step-right">
            <svg
              viewBox="0 0 28 50"
              className="w-3.5 h-6 sm:w-4 sm:h-7 filter drop-shadow-xs"
              fill="none"
              style={{ transform: 'scaleX(-1)' }}
            >
              <path
                d="M 14 47
                   C 10 47, 7 44, 7 39
                   C 7 33, 8 28, 8 23
                   C 8 18, 7 15, 10 13
                   C 13 11, 18 11, 21 13
                   C 23 15, 23 19, 21 23
                   C 18 27, 14 30, 14 34
                   C 14 38, 17 41, 17 44
                   C 17 47, 15 47, 14 47 Z"
                fill="url(#csmFootGradLeft)"
              />
              <path d="M 10 17 Q 15 15 19 17" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 10 22 Q 15 20 18 22" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 9 39 Q 13 37 16 39" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
              <path d="M 10 43 Q 13 41 15 43" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />

              <ellipse cx="19" cy="5.5" rx="2.8" ry="3.6" fill="#7C3AED" />
              <ellipse cx="14" cy="6.2" rx="2.2" ry="2.8" fill="#7C3AED" />
              <ellipse cx="9.8" cy="8.0" rx="1.8" ry="2.3" fill="#7C3AED" />
              <ellipse cx="6.4" cy="10.8" rx="1.5" ry="1.9" fill="#7C3AED" />
              <ellipse cx="3.8" cy="14.2" rx="1.2" ry="1.5" fill="#7C3AED" />
            </svg>
          </div>
        </div>

        {/* Circular Bottom CSM Monogram Badge */}
        <span className="absolute -bottom-1 px-1.5 py-0.2 bg-[#5B21B6] text-white text-[7px] font-black uppercase rounded-full shadow-2xs tracking-wider leading-none">
          CSM
        </span>
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
