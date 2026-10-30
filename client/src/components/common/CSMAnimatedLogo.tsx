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
          AUTHENTIC OFFICIAL CSM EMBLEM (PROPER STORE SIGN BOARD FOOTSTEPS)
          - Official store logo image with proper, natural footsteps
          - Authentic heart and CSM pill geometry
         ======================================================== */}
      <div className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
        variant === 'navbar' ? 'h-10 sm:h-11 w-auto' :
        variant === 'footer' ? 'h-12 sm:h-14 w-auto' :
        variant === 'hero' ? 'h-14 sm:h-16 w-auto' :
        'h-10 w-auto'
      }`}>
        <img
          src="/csm_original_logo.png"
          alt="Chandhana Shoe Mart (CSM) Official Logo"
          className="h-full w-auto object-contain drop-shadow-xs"
        />
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
