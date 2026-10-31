import React from 'react';

export interface BrandLogoProps {
  brand: string;
  className?: string;
  variant?: 'full' | 'emblem';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brand, className = 'w-10 h-8', variant = 'full' }) => {
  const norm = (brand || '').trim().toLowerCase();

  // 1. WALKAROO
  if (norm.includes('walkaroo')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M6 24 C14 10 24 10 32 18 C26 14 18 16 12 25 Z" fill="#FF5500" />
          <path d="M12 28 C20 18 28 18 36 24 C30 22 24 23 18 29 Z" fill="#F59E0B" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <path d="M6 22 C14 10 22 10 29 17 C23 14 17 15 12 23 Z" fill="#FF5500" />
        <path d="M12 26 C19 17 26 17 33 22 C27 20 22 21 17 27 Z" fill="#F59E0B" />
        <text x="70" y="26" textAnchor="middle" fontSize="15" fontWeight="900" fontStyle="italic" letterSpacing="0.4" fill="#FF5500">
          walkaroo
        </text>
      </svg>
    );
  }

  // 2. SPARX
  if (norm.includes('sparx')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M8 10 L20 20 L8 30 L16 30 L28 20 L16 10 Z" fill="#EA580C" />
          <path d="M22 10 L34 20 L22 30 L30 30 L38 20 L30 10 Z" fill="#F59E0B" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <path d="M6 13 L14 20 L6 27 L11 27 L19 20 L11 13 Z" fill="#EA580C" />
        <path d="M15 13 L23 20 L15 27 L20 27 L28 20 L20 13 Z" fill="#F59E0B" />
        <text x="66" y="27" textAnchor="middle" fontSize="18" fontWeight="900" fontStyle="italic" letterSpacing="1" fill="#EA580C">
          SPARX
        </text>
      </svg>
    );
  }

  // 3. VKC PRIDE
  if (norm.includes('vkc')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M20 4 L34 10 L34 24 C34 32 20 37 20 37 C20 37 6 32 6 24 L6 10 Z" fill="#991B1B" />
          <path d="M12 18 L16 26 L20 16 L24 26 L28 18" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <path d="M16 6 L26 10 L26 22 C26 28 16 32 16 32 C16 32 6 28 6 22 L6 10 Z" fill="#991B1B" />
        <path d="M10 16 L13 22 L16 14 L19 22 L22 16" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="68" y="22" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing="1" fill="#991B1B">
          VKC PRIDE
        </text>
        <text x="68" y="32" textAnchor="middle" fontSize="6.5" fontWeight="700" letterSpacing="1.2" fill="#D97706">
          FAMILY FOOTWEAR
        </text>
      </svg>
    );
  }

  // 4. PARAGON
  if (norm.includes('paragon')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <ellipse cx="20" cy="20" rx="18" ry="14" fill="#DC2626" />
          <path d="M20 12 L22 17 L27 17 L23 20 L25 25 L20 22 L15 25 L17 20 L13 17 L18 17 Z" fill="#FACC15" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <rect x="5" y="7" width="100" height="26" rx="13" fill="#DC2626" />
        <text x="55" y="25" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing="1.8" fill="#FFFFFF">
          PARAGON
        </text>
      </svg>
    );
  }

  // 5. WALKMATE
  if (norm.includes('walkmate')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="17" fill="#047857" />
          <path d="M12 25 C16 15 24 15 28 25" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 115 40" className={className}>
        <circle cx="16" cy="20" r="12" fill="#047857" />
        <path d="M10 23 C13 17 19 17 22 23" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" fill="none" />
        <text x="68" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="0.8" fill="#065F46">
          WALKMATE
        </text>
      </svg>
    );
  }

  // 6. STRIKER
  if (norm.includes('striker')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <polygon points="20,4 36,20 28,36 12,36 4,20" fill="#2563EB" />
          <polygon points="20,10 30,20 24,30 16,30 10,20" fill="#93C5FD" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <polygon points="12,8 24,20 18,32 6,32 0,20" fill="#2563EB" />
        <text x="64" y="26" textAnchor="middle" fontSize="15" fontWeight="900" fontStyle="italic" letterSpacing="1.5" fill="#1D4ED8">
          STRIKER
        </text>
      </svg>
    );
  }

  // 7. BRANO
  if (norm.includes('brano')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="6" y="6" width="28" height="28" rx="8" fill="#5B21B6" />
          <text x="20" y="27" textAnchor="middle" fontSize="18" fontWeight="900" fill="#EDE9FE">B</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <rect x="6" y="8" width="24" height="24" rx="6" fill="#5B21B6" />
        <text x="18" y="25" textAnchor="middle" fontSize="15" fontWeight="900" fill="#EDE9FE">B</text>
        <text x="65" y="26" textAnchor="middle" fontSize="16" fontWeight="900" letterSpacing="2" fill="#4C1D95">
          BRANO
        </text>
      </svg>
    );
  }

  // 8. REDFORT
  if (norm.includes('redfort')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M8 28 L8 16 L14 16 L14 12 L20 12 L20 16 L26 16 L26 12 L32 12 L32 28 Z" fill="#B91C1C" />
          <rect x="17" y="22" width="6" height="6" fill="#FEF2F2" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 115 40" className={className}>
        <path d="M6 26 L6 14 L10 14 L10 10 L14 10 L14 14 L18 14 L18 10 L22 10 L22 26 Z" fill="#B91C1C" />
        <text x="68" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1.2" fill="#991B1B">
          REDFORT
        </text>
      </svg>
    );
  }

  // 9. ZAGUAAR
  if (norm.includes('zaguaar') || norm.includes('jaguar')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="17" fill="#0D9488" />
          <path d="M10 20 L20 12 L30 20 L20 28 Z" fill="#CCFBF1" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 115 40" className={className}>
        <circle cx="16" cy="20" r="12" fill="#0D9488" />
        <path d="M10 20 L16 15 L22 20 L16 25 Z" fill="#CCFBF1" />
        <text x="68" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1.2" fill="#0F766E">
          ZAGUAAR
        </text>
      </svg>
    );
  }

  // 10. HISON
  if (norm.includes('hison')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <polygon points="20,6 34,32 6,32" fill="#0284C7" />
          <text x="20" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFFFFF">H</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <polygon points="16,8 28,30 4,30" fill="#0284C7" />
        <text x="64" y="26" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="1.5" fill="#0369A1">
          HISON
        </text>
      </svg>
    );
  }

  // 11. POSTER SHOES
  if (norm.includes('poster')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="8" y="6" width="24" height="28" rx="4" fill="#9D174D" />
          <text x="20" y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill="#FFFFFF">P</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 125 40" className={className}>
        <rect x="6" y="8" width="20" height="24" rx="3" fill="#9D174D" />
        <text x="74" y="25" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing="1" fill="#831843">
          POSTER SHOES
        </text>
      </svg>
    );
  }

  // 12. LANCER
  if (norm.includes('lancer')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <polygon points="20,5 34,14 28,34 12,34 6,14" fill="#1E3A5F" />
          <polygon points="20,10 28,18 24,28 16,28 12,18" fill="#60A5FA" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <polygon points="14,8 24,15 20,30 8,30 4,15" fill="#1E3A5F" />
        <text x="64" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1.2" fill="#1E3A5F">
          LANCER
        </text>
      </svg>
    );
  }

  // 13. JOCKEY (Only Socks)
  if (norm.includes('jockey')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="6" y="6" width="28" height="28" rx="14" fill="#1F2937" />
          <text x="20" y="26" textAnchor="middle" fontSize="16" fontWeight="900" fontStyle="italic" fill="#FFFFFF">J</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <rect x="6" y="8" width="24" height="24" rx="12" fill="#1F2937" />
        <text x="18" y="25" textAnchor="middle" fontSize="14" fontWeight="900" fontStyle="italic" fill="#FFFFFF">J</text>
        <text x="66" y="24" textAnchor="middle" fontSize="14" fontWeight="900" fontStyle="italic" letterSpacing="1.2" fill="#111827">
          JOCKEY
        </text>
        <text x="66" y="33" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="1" fill="#6B7280">
          GENUINE SOCKS
        </text>
      </svg>
    );
  }

  // 14. SUSHMA (Ladies Brand)
  if (norm.includes('sushma')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="17" fill="#DB2777" />
          <path d="M14 26 C12 18 20 12 26 14 C22 18 24 24 20 26 Z" fill="#FCE7F3" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <circle cx="16" cy="20" r="12" fill="#DB2777" />
        <path d="M12 24 C10 18 16 14 20 15 C17 18 18 22 15 24 Z" fill="#FCE7F3" />
        <text x="65" y="23" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1" fill="#BE185D">
          SUSHMA
        </text>
        <text x="65" y="32" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="1" fill="#EC4899">
          LADIES FOOTWEAR
        </text>
      </svg>
    );
  }

  // 15. TR SELECTIONS (Ladies Brand)
  if (norm.includes('tr selections') || norm.includes('tr selection') || norm.includes('tr')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="6" y="6" width="28" height="28" rx="8" fill="#9333EA" />
          <text x="20" y="26" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FAF5FF">TR</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 125 40" className={className}>
        <rect x="6" y="8" width="24" height="24" rx="6" fill="#9333EA" />
        <text x="18" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FAF5FF">TR</text>
        <text x="74" y="23" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="1.2" fill="#7E22CE">
          TR SELECTIONS
        </text>
        <text x="74" y="32" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="0.8" fill="#A855F7">
          WOMEN COLLECTION
        </text>
      </svg>
    );
  }

  // 16. ZM SELECTIONS (Ladies Brand)
  if (norm.includes('zm selections') || norm.includes('zm selection') || norm.includes('zm')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="6" y="6" width="28" height="28" rx="8" fill="#EA580C" />
          <text x="20" y="26" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFF7ED">ZM</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 125 40" className={className}>
        <rect x="6" y="8" width="24" height="24" rx="6" fill="#EA580C" />
        <text x="18" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FFF7ED">ZM</text>
        <text x="74" y="23" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="1.2" fill="#C2410C">
          ZM SELECTIONS
        </text>
        <text x="74" y="32" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="0.8" fill="#F97316">
          WOMEN COMFORT
        </text>
      </svg>
    );
  }

  // 17. AIRPISTHA
  if (norm.includes('airpistha') || norm.includes('air')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="17" fill="#0284C7" />
          <path d="M10 24 C16 14 24 26 30 16" stroke="#E0F2FE" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 115 40" className={className}>
        <circle cx="16" cy="20" r="12" fill="#0284C7" />
        <path d="M9 23 C13 16 19 24 23 17" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" fill="none" />
        <text x="68" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1" fill="#0369A1">
          AIRPISTHA
        </text>
      </svg>
    );
  }

  // 18. DOCTOR CHOICE
  if (norm.includes('doctor') || norm.includes('ortho')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="17" fill="#047857" />
          <path d="M20 11 L20 29 M11 20 L29 20" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 135 40" className={className}>
        <circle cx="16" cy="20" r="12" fill="#047857" />
        <path d="M16 13 L16 27 M9 20 L23 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <text x="76" y="23" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing="0.8" fill="#065F46">
          DOCTOR CHOICE
        </text>
        <text x="76" y="32" textAnchor="middle" fontSize="6.5" fontWeight="800" letterSpacing="0.8" fill="#10B981">
          ORTHO COMFORT
        </text>
      </svg>
    );
  }

  // Fallback styled badge
  return (
    <div className="flex items-center justify-center px-2 py-1 text-center font-black text-xs text-slate-800 tracking-wider">
      {brand}
    </div>
  );
};

export default BrandLogo;
