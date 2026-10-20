import React from 'react';
import { Phone, MessageCircle, Truck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 text-white text-xs py-2.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Contact Info */}
        <div className="hidden md:flex items-center gap-4 text-red-50">
          <a
            href="tel:+919845012345"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 98450 12345</span>
          </a>
          <span className="text-red-400">|</span>
          <a
            href="https://wa.me/919845012345?text=Hi%20Chandhana%20Shoe%20Mart,%20I%20have%20an%20enquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white hover:underline transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>

        {/* Center: Promo Ticker */}
        <div className="flex-1 text-center flex items-center justify-center gap-2 font-medium text-white">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
          <span className="truncate">
            <span className="font-bold">Grand Season Launch:</span> Flat 10% off with code{' '}
            <span className="font-mono bg-white text-red-600 px-2 py-0.5 rounded-full font-black text-[11px] shadow-sm">
              WELCOME10
            </span>{' '}
            • Free Express Delivery on orders over ₹999
          </span>
        </div>

        {/* Right: Shipping perk */}
        <div className="hidden lg:flex items-center gap-1.5 text-red-50">
          <Truck className="w-3.5 h-3.5" />
          <span>Pan-India Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
