import React from 'react';

interface BrandLogoProps {
  brand: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brand, className = 'w-10 h-8' }) => {
  const norm = brand.trim().toLowerCase();

  if (norm.includes('nike')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <path d="M12 28 C 30 34, 60 22, 92 6 C 75 14, 50 26, 30 26 C 22 26, 15 22, 12 28 Z" />
      </svg>
    );
  }

  if (norm.includes('puma')) {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="currentColor">
        {/* Sleek jumping puma silhouette */}
        <path d="M85 10 C80 8 72 12 68 15 C62 13 54 12 46 16 C38 20 32 28 26 29 C20 30 14 27 10 24 C12 28 16 33 22 34 C28 35 34 32 40 28 C46 24 53 22 60 25 C66 28 72 32 78 30 C82 28 86 22 88 18 C90 14 88 11 85 10 Z" />
        <text x="50" y="46" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="2">
          PUMA
        </text>
      </svg>
    );
  }

  if (norm.includes('adidas')) {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="currentColor">
        {/* Three classic ascending diagonal bars */}
        <path d="M22 34 L32 34 L26 24 L16 24 Z" />
        <path d="M40 34 L50 34 L40 18 L30 18 Z" />
        <path d="M58 34 L68 34 L54 11 L44 11 Z" />
        <text x="45" y="46" textAnchor="middle" fontSize="10" fontWeight="900" letterSpacing="1.5">
          adidas
        </text>
      </svg>
    );
  }

  if (norm.includes('skechers')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="currentColor">
        <rect x="5" y="10" width="90" height="20" rx="4" fill="#0284c7" />
        <text x="50" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontStyle="italic" letterSpacing="1">
          SKECHERS
        </text>
      </svg>
    );
  }

  if (norm.includes('crocs')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="currentColor">
        <circle cx="28" cy="22" r="16" fill="#16a34a" />
        {/* Croc eye/jaw outline */}
        <path d="M22 22 Q 28 16 34 22 Q 28 26 22 22 Z" fill="#ffffff" />
        <circle cx="31" cy="20" r="1.5" fill="#16a34a" />
        <text x="68" y="27" textAnchor="middle" fontSize="14" fontWeight="900" letterSpacing="0.5">
          crocs
        </text>
      </svg>
    );
  }

  if (norm.includes('red tape')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="#dc2626">
        {/* Stylized wings */}
        <path d="M15 18 C28 14 42 16 48 22 C42 21 28 22 15 18 Z" />
        <path d="M85 18 C72 14 58 16 52 22 C58 21 72 22 85 18 Z" />
        <text x="50" y="34" textAnchor="middle" fontSize="10" fontWeight="900" letterSpacing="1.5">
          RED TAPE
        </text>
      </svg>
    );
  }

  if (norm.includes('woodland')) {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="#15803d">
        {/* Tree emblem */}
        <circle cx="50" cy="18" r="12" fill="#15803d" />
        <path d="M48 24 L52 24 L52 30 L48 30 Z" fill="#78350f" />
        <circle cx="46" cy="16" r="3" fill="#ffffff" opacity="0.3" />
        <circle cx="54" cy="16" r="3" fill="#ffffff" opacity="0.3" />
        <text x="50" y="44" textAnchor="middle" fontSize="8.5" fontWeight="900" letterSpacing="2">
          WOODLAND
        </text>
      </svg>
    );
  }

  if (norm.includes('bata')) {
    return (
      <svg viewBox="0 0 100 40" className={className}>
        <text
          x="50"
          y="28"
          textAnchor="middle"
          fill="#dc2626"
          fontSize="22"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="Georgia, serif"
        >
          Bata
        </text>
      </svg>
    );
  }

  if (norm.includes('asics')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="#1e3a8a">
        <text x="50" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fontStyle="italic" letterSpacing="1.5">
          asics
        </text>
      </svg>
    );
  }

  if (norm.includes('campus')) {
    return (
      <svg viewBox="0 0 100 45" className={className}>
        <path d="M42 16 C 48 10 58 10 62 16 C 56 14 48 15 42 16 Z" fill="#dc2626" />
        <path d="M38 20 C 46 14 62 14 66 22 C 58 18 46 19 38 20 Z" fill="#dc2626" />
        <text x="50" y="36" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="900" letterSpacing="1.5">
          CAMPUS
        </text>
      </svg>
    );
  }

  if (norm.includes('hrx')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="#111827">
        <text x="50" y="24" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="2">
          HRX
        </text>
        <text x="50" y="36" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="0.5" fill="#64748b">
          BY HRITHIK ROSHAN
        </text>
      </svg>
    );
  }

  if (norm.includes('reebok')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="#111827">
        {/* Reebok delta vector icon */}
        <path d="M25 15 L75 22 L70 25 L30 18 Z" />
        <path d="M25 25 L75 18 L70 15 L30 22 Z" />
        <text x="50" y="38" textAnchor="middle" fontSize="11" fontWeight="900" letterSpacing="2">
          Reebok
        </text>
      </svg>
    );
  }

  if (norm.includes('sparx')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="#ea580c">
        <text x="50" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fontStyle="italic" letterSpacing="1">
          Sparx
        </text>
      </svg>
    );
  }

  if (norm.includes('relaxo')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="#0284c7">
        <text x="50" y="26" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="1.5">
          RELAXO
        </text>
      </svg>
    );
  }

  if (norm.includes('red chief')) {
    return (
      <svg viewBox="0 0 100 45" className={className} fill="#b91c1c">
        <text x="50" y="24" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="1">
          RED CHIEF
        </text>
        <text x="50" y="36" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="1" fill="#78350f">
          LEATHER GEAR
        </text>
      </svg>
    );
  }

  if (norm.includes('metro')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="#701a75">
        <text x="50" y="26" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="2">
          METRO
        </text>
      </svg>
    );
  }

  if (norm.includes('new balance')) {
    return (
      <svg viewBox="0 0 100 40" className={className} fill="#dc2626">
        <text x="50" y="27" textAnchor="middle" fontSize="18" fontWeight="900" fontStyle="italic" letterSpacing="-1">
          N
        </text>
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
