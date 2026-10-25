import React from 'react';
import { Phone, MessageCircle, Sparkles, MapPin } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#2E1065] text-white text-xs py-2 px-3 sm:px-4 shadow-sm border-b border-[#3B0764]">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Direct Store Cell & WhatsApp */}
        <div className="flex items-center gap-3 text-purple-200 text-[11px] sm:text-xs">
          <a
            href="tel:9553536884"
            className="flex items-center gap-1.5 hover:text-[#E9D5FF] transition-colors font-bold"
            title="Call Chandhana Shoe Mart"
          >
            <Phone className="w-3.5 h-3.5 text-[#C4B5FD] shrink-0" />
            <span>Cell: 9553536884</span>
          </a>
          <span className="text-[#6D28D9] hidden md:inline">|</span>
          <a
            href="https://wa.me/919553536884?text=Hello%20Chandhana%20Shoe%20Mart,%20I%20have%20an%20enquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-white hover:text-[#E9D5FF] transition-colors font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#C4B5FD]" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Center: Promo & Telugu Tagline */}
        <div className="flex-1 text-center flex items-center justify-center gap-2 font-medium text-white text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD] animate-pulse shrink-0" />
          <span className="truncate">
            <strong className="font-serif text-[#E9D5FF]">పాదరక్షల బృందావనం:</strong> Flat 15% Off with code{' '}
            <span className="font-mono bg-[#E9D5FF] text-[#4C1D95] px-2 py-0.5 rounded-full font-black text-[10px] shadow-sm tracking-wider">
              WELCOME15
            </span>{' '}
            • Free Delivery Over ₹999
          </span>
        </div>

        {/* Right: Real Store Landmark */}
        <div className="hidden lg:flex items-center gap-1.5 text-purple-200 text-[11px] font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#C4B5FD] shrink-0" />
          <span>Opp: Tata Theatre, Main Road, Tagarapuvalasa-531162</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
