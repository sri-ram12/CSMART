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
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 group select-none shrink-0 min-w-0 ${className}`}
      title="Chandhana Shoe Mart (CSM) - Quality First • పాదరక్షల బృందావనం"
    >
      {/* ========================================================
          AUTHENTIC CSM EMBLEM (STRICTLY FROM STORE SIGN BOARD)
          - Solid Black Anatomical Footprints (5 arched toes each)
          - Vibrant Hot Pink Heart nestled between the inner arches
          - Connected White Capsule Pill with Bold Italic Hot Pink "CSM"
          - "Quality First..." Script Tagline underneath
          - Proportions & Aspect Ratio: 136x94 (Exact 1.45:1 match)
         ======================================================== */}
      <div className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
        variant === 'navbar' ? 'h-11 sm:h-12 w-[64px] sm:w-[70px]' :
        variant === 'footer' ? 'h-14 sm:h-16 w-[81px] sm:w-[93px]' :
        variant === 'hero' ? 'h-16 sm:h-20 w-[93px] sm:w-[116px]' :
        'h-11 w-[64px]'
      }`}>
        <svg
          viewBox="0 0 136 94"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="csmHeartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#E11D48" floodOpacity="0.45" />
            </filter>
            <filter id="csmPillShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Connected White Contour / Sticker Outline matching real banner */}
          <path
            d="M 23 88 C 13 88 8 78 8 66 C 8 46 11 34 18 24 C 23 18 30 18 34 23 C 37 19 41 19 44 23 C 49 18 56 18 60 24 C 65 30 67 40 67 52 L 112 52 C 124 52 133 60 133 72 C 133 84 124 92 112 92 L 67 92 C 62 92 56 90 52 86 C 45 92 37 92 23 88 Z"
            fill="#FFFFFF"
          />

          {/* White Capsule Pill Body for "CSM" */}
          <rect
            x="52"
            y="24"
            width="80"
            height="40"
            rx="20"
            ry="20"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1.2"
            filter="url(#csmPillShadow)"
          />

          {/* ==================== LEFT FOOTPRINT (Solid Black) ==================== */}
          <g id="leftFoot">
            <path
              d="M 23 80
                 C 16 80 12 73 12 63
                 C 12 48 16 38 21 29
                 C 24 24 30 25 32 29
                 C 34 33 29 40 26 46
                 C 22 53 22 60 23 67
                 C 24 74 27 77 26.5 79.5
                 C 26 80 24.5 80 23 80 Z"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* 5 Left Toes (Tapering from inside big toe to outside pinky) */}
            <ellipse cx="32.0" cy="18.5" rx="3.4" ry="4.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.1" />
            <ellipse cx="25.5" cy="17.0" rx="2.9" ry="3.7" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.0" />
            <ellipse cx="19.5" cy="18.5" rx="2.4" ry="3.0" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.9" />
            <ellipse cx="14.5" cy="22.0" rx="2.0" ry="2.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.9" />
            <ellipse cx="10.5" cy="27.0" rx="1.6" ry="2.0" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>

          {/* ==================== RIGHT FOOTPRINT (Solid Black) ==================== */}
          <g id="rightFoot">
            <path
              d="M 49 80
                 C 56 80 60 73 60 63
                 C 60 48 56 38 51 29
                 C 48 24 42 25 40 29
                 C 38 33 43 40 46 46
                 C 50 53 50 60 49 67
                 C 48 74 45 77 45.5 79.5
                 C 46 80 47.5 80 49 80 Z"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* 5 Right Toes */}
            <ellipse cx="40.0" cy="18.5" rx="3.4" ry="4.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.1" />
            <ellipse cx="46.5" cy="17.0" rx="2.9" ry="3.7" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.0" />
            <ellipse cx="52.5" cy="18.5" rx="2.4" ry="3.0" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.9" />
            <ellipse cx="57.5" cy="22.0" rx="2.0" ry="2.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.9" />
            <ellipse cx="61.5" cy="27.0" rx="1.6" ry="2.0" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>

          {/* ==================== VIBRANT HOT PINK HEART ==================== */}
          <path
            d="M 36 57
               L 33.8 54.8
               C 29.0 50.3 25.5 47.2 25.5 43.3
               C 25.5 40.1 28.0 37.6 31.2 37.6
               C 33.0 37.6 34.7 38.5 36.0 39.8
               C 37.3 38.5 39.0 37.6 40.8 37.6
               C 44.0 37.6 46.5 40.1 46.5 43.3
               C 46.5 47.2 43.0 50.3 38.2 54.8
               Z"
            fill="#E11D48"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinejoin="round"
            filter="url(#csmHeartGlow)"
            className="animate-pulse"
          />

          {/* ==================== BOLD ITALIC HOT PINK "CSM" ==================== */}
          {/* 3D Drop Shadow */}
          <text
            x="93"
            y="53"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="28"
            fill="#9F1239"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            CSM
          </text>
          {/* Foreground Hot Pink */}
          <text
            x="92"
            y="52"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
            fontWeight="900"
            fontStyle="italic"
            fontSize="28"
            fill="#E11D48"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            CSM
          </text>

          {/* ==================== "Quality First..." SCRIPT TAGLINE ==================== */}
          <text
            x="92"
            y="76"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
            fontStyle="italic"
            fontSize="11"
            fill="#312E81"
            textAnchor="middle"
            letterSpacing="0.2"
          >
            Quality First...
          </text>
        </svg>
      </div>

      {/* ========================================================
          ACCURATE BRAND TYPOGRAPHY & HERITAGE TELUGU TITLES
          - Vertically centered with the emblem
          - Matches the store banner board identity
         ======================================================== */}
      <div className="flex flex-col min-w-0 justify-center">
        {/* Row 1: English Brand Name with Crisp Spacing */}
        <div className="flex items-center min-w-0">
          <span className="font-sans font-black text-xs sm:text-sm md:text-base text-slate-900 group-hover:text-[#5B21B6] tracking-wider uppercase transition-colors whitespace-nowrap truncate">
            CHANDHANA SHOE MART
          </span>
        </div>

        {/* Row 2: Telugu Heritage Titles from Sign Board */}
        {showTagline && (
          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 leading-none flex-nowrap min-w-0">
            {/* Authentic 3D Telugu: చందన (Red) & షూమార్ట్ (Blue) */}
            <span className="font-serif font-black text-[11px] sm:text-xs text-red-600 drop-shadow-[0_1px_1px_rgba(239,68,68,0.2)] tracking-tight shrink-0">
              చందన
            </span>
            <span className="font-serif font-black text-[11px] sm:text-xs text-[#2563EB] drop-shadow-[0_1px_1px_rgba(37,99,235,0.2)] tracking-tight shrink-0">
              షూమార్ట్
            </span>

            <span className="text-slate-300 text-[10px] hidden min-[480px]:inline">•</span>

            {/* Heritage Telugu Title from Store Board */}
            <span className="text-[8px] sm:text-[9px] font-bold text-[#5B21B6] bg-[#EDE9FE] px-1.5 py-0.5 rounded font-serif shrink-0 hidden min-[480px]:inline">
              పాదరక్షల బృందావనం
            </span>

            {/* Quality First Slogan */}
            <span className="text-[8px] sm:text-[9px] font-semibold text-slate-500 italic tracking-tight hidden lg:inline truncate">
              Quality First...
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CSMAnimatedLogo;
