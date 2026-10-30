import React from 'react';

export interface BrandLogoProps {
  brand: string;
  className?: string;
  variant?: 'full' | 'emblem';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brand, className = 'w-10 h-8', variant = 'full' }) => {
  const norm = brand.trim().toLowerCase();

  // 1. WALKAROO (Official orange boomerang swooshes + modern lowercase walkaroo)
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
        {/* Walkaroo Dynamic Double Swoosh Emblem */}
        <path d="M6 22 C14 10 22 10 29 17 C23 14 17 15 12 23 Z" fill="#FF5500" />
        <path d="M12 26 C19 17 26 17 33 22 C27 20 22 21 17 27 Z" fill="#F59E0B" />
        <text
          x="70"
          y="26"
          textAnchor="middle"
          fontSize="15"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="0.4"
          fill="#FF5500"
        >
          walkaroo
        </text>
      </svg>
    );
  }

  // 2. SPARX (Dynamic sharp energetic X chevrons + Sparx typography)
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
        {/* Sparx Double Arrow / Spark Emblem */}
        <path d="M6 13 L14 20 L6 27 L11 27 L19 20 L11 13 Z" fill="#EA580C" />
        <path d="M15 13 L23 20 L15 27 L20 27 L28 20 L20 13 Z" fill="#F59E0B" />
        <text
          x="66"
          y="27"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="1"
          fill="#EA580C"
        >
          SPARX
        </text>
      </svg>
    );
  }

  // 3. VKC PRIDE (Royal Red Shield with Gold Crown & Pride Wings)
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

  // 4. PARAGON (Iconic Red Oval + White Bold PARAGON + Gold Star)
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

  // 5. CAMPUS (Dual Athletic Red Wings + Bold CAMPUS)
  if (norm.includes('campus')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M10 16 C 18 10 30 10 34 16 C 26 14 18 15 10 16 Z" fill="#DC2626" />
          <path d="M6 22 C 16 15 34 15 38 24 C 28 19 16 21 6 22 Z" fill="#DC2626" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 42" className={className}>
        <path d="M42 12 C 48 6 58 6 62 12 C 56 10 48 11 42 12 Z" fill="#DC2626" />
        <path d="M38 17 C 46 11 62 11 66 19 C 58 15 46 16 38 17 Z" fill="#DC2626" />
        <text x="52" y="34" textAnchor="middle" fill="#DC2626" fontSize="13" fontWeight="900" letterSpacing="1.5">
          CAMPUS
        </text>
      </svg>
    );
  }

  // 6. AQUALITE (Aqua Droplet & Curved Walking Wave)
  if (norm.includes('aqualite')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M20 6 C20 6 10 18 10 25 C10 31 14.5 35 20 35 C25.5 35 30 31 30 25 C30 18 20 6 20 6 Z" fill="#0284C7" />
          <path d="M15 25 C15 22 17 20 20 18" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <path d="M16 10 C16 10 8 20 8 25 C8 29.5 11.5 33 16 33 C20.5 33 24 29.5 24 25 C24 20 16 10 16 10 Z" fill="#0284C7" />
        <text x="68" y="27" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="0.8" fill="#0369A1">
          aqualite
        </text>
      </svg>
    );
  }

  // 7. LANCER (High-Speed Athletic Arrow Shield + Lancer)
  if (norm.includes('lancer')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <polygon points="20,5 34,14 28,34 12,34 6,14" fill="#2563EB" />
          <polygon points="20,10 28,18 24,28 16,28 12,18" fill="#60A5FA" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <polygon points="14,8 24,15 20,30 8,30 4,15" fill="#2563EB" />
        <text x="64" y="26" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="1.2" fill="#1D4ED8">
          LANCER
        </text>
      </svg>
    );
  }

  // 8. BATA (Classic Timeless Red Script)
  if (norm.includes('bata')) {
    return (
      <svg viewBox="0 0 95 38" className={className}>
        <text
          x="47"
          y="28"
          textAnchor="middle"
          fill="#DC2626"
          fontSize="24"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="Georgia, serif"
        >
          Bata
        </text>
      </svg>
    );
  }

  // 9. RELAXO (Comfort Blue Pill + RELAXO Typography)
  if (norm.includes('relaxo')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <rect x="5" y="10" width="30" height="20" rx="8" fill="#0284C7" />
          <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
            R
          </text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <rect x="4" y="8" width="97" height="24" rx="12" fill="#0284C7" />
        <text x="52" y="25" textAnchor="middle" fontSize="13" fontWeight="900" letterSpacing="1.5" fill="#FFFFFF">
          RELAXO
        </text>
      </svg>
    );
  }

  // 10. FLITE (Aerodynamic Wing + FLITE by Relaxo)
  if (norm.includes('flite')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <path d="M6 24 C14 12 26 12 34 20 C24 16 16 18 6 24 Z" fill="#DC2626" />
          <path d="M10 28 C18 18 28 18 36 24 C26 22 18 23 10 28 Z" fill="#FBBF24" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 105 40" className={className}>
        <path d="M8 18 C16 8 26 8 32 15 C24 12 16 14 8 18 Z" fill="#DC2626" />
        <text x="66" y="27" textAnchor="middle" fontSize="15" fontWeight="900" fontStyle="italic" letterSpacing="1" fill="#DC2626">
          FLITE
        </text>
      </svg>
    );
  }

  // 11. BAHAMAS (Tropical Palm + Bahamas Casual Comfort)
  if (norm.includes('bahamas')) {
    if (variant === 'emblem') {
      return (
        <svg viewBox="0 0 40 40" className={className}>
          <circle cx="20" cy="20" r="16" fill="#F59E0B" opacity="0.25" />
          {/* Palm trunk & fronds */}
          <path d="M19 32 Q21 22 20 15" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M20 15 Q14 12 10 16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M20 15 Q26 12 30 16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M20 15 Q20 8 18 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 40" className={className}>
        <path d="M14 30 Q16 20 15 14" stroke="#78350F" strokeWidth="2" fill="none" />
        <path d="M15 14 Q10 11 7 15" stroke="#10B981" strokeWidth="1.8" fill="none" />
        <path d="M15 14 Q20 11 23 15" stroke="#10B981" strokeWidth="1.8" fill="none" />
        <text x="64" y="26" textAnchor="middle" fontSize="13" fontWeight="900" fontStyle="italic" fill="#0D9488">
          bahamas
        </text>
      </svg>
    );
  }

  // 12. CROCS
  if (norm.includes('crocs')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="currentColor">
        <circle cx="28" cy="22" r="16" fill="#16a34a" />
        <path d="M22 22 Q 28 16 34 22 Q 28 26 22 22 Z" fill="#ffffff" />
        <circle cx="31" cy="20" r="1.5" fill="#16a34a" />
        <text x="68" y="27" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="0.5">
          crocs
        </text>
      </svg>
    );
  }

  // 13. PUMA
  if (norm.includes('puma')) {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="currentColor">
        <path d="M85 10 C80 8 72 12 68 15 C62 13 54 12 46 16 C38 20 32 28 26 29 C20 30 14 27 10 24 C12 28 16 33 22 34 C28 35 34 32 40 28 C46 24 53 22 60 25 C66 28 72 32 78 30 C82 28 86 22 88 18 C90 14 88 11 85 10 Z" />
        <text x="50" y="46" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="2">
          PUMA
        </text>
      </svg>
    );
  }

  // 14. ADIDAS
  if (norm.includes('adidas')) {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="currentColor">
        <path d="M22 34 L32 34 L26 24 L16 24 Z" />
        <path d="M40 34 L50 34 L40 18 L30 18 Z" />
        <path d="M58 34 L68 34 L54 11 L44 11 Z" />
        <text x="45" y="46" textAnchor="middle" fontSize="10" fontWeight="900" letterSpacing="1.5">
          adidas
        </text>
      </svg>
    );
  }

  // 15. NIKE
  if (norm.includes('nike')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <path d="M12 28 C 30 34, 60 22, 92 6 C 75 14, 50 26, 30 26 C 22 26, 15 22, 12 28 Z" />
      </svg>
    );
  }

  // Fallback cleanly styled badge
  return (
    <div className="flex items-center justify-center px-2 py-1 text-center font-black text-xs text-slate-800 tracking-wider">
      {brand}
    </div>
  );
};

