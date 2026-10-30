import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { CSMAnimatedLogo } from '../common/CSMAnimatedLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F0E5FC] text-[#2E1065] pt-16 pb-12 mt-16 border-t border-[#DFCBF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links Columns (Inspired by Reference Image Footer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-purple-200/80">
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-xs border border-purple-100">
              <CSMAnimatedLogo variant="footer" />
            </div>
            <p className="text-xs text-[#4C1D95] leading-relaxed max-w-sm">
              <strong className="font-serif font-black text-[#5B21B6]">పాదరక్షల బృందావనం</strong> — Established with a relentless obsession for comfort, chic styles, and ergonomic craftsmanship. Footwear for the entire family with quality first.
            </p>

            <div className="space-y-2.5 text-xs text-[#3B0764] pt-2 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://maps.app.goo.gl/YBteoVzaYAF12mW97"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#5B21B6] transition-colors font-semibold flex items-center gap-1.5"
                    title="Open in Google Maps"
                  >
                    <span>Opp: Tata Theatre, Main Road, Tagarapuvalasa - 531162</span>
                    <span className="text-[10px] font-bold text-[#5B21B6] bg-white px-1.5 py-0.5 rounded border border-purple-200">
                      Maps ↗
                    </span>
                  </a>
                  <p className="text-[11px] text-[#6B21A8]/80 mt-0.5">
                    Open: 9:00 AM – 9:00 PM (Tue Closed)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <a href="tel:09553536884" className="hover:text-[#5B21B6] font-bold transition-colors">
                  Cell: +91 95535 36884
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <a
                  href="https://wa.me/919553536884?text=Hello%20Chandhana%20Shoe%20Mart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#5B21B6] font-medium transition-colors"
                >
                  WhatsApp: +91 9553536884
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <a href="mailto:support@chandhanashoemart.com" className="hover:text-[#5B21B6] transition-colors">
                  support@chandhanashoemart.com
                </a>
              </div>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E0842]">SHOP</h4>
            <ul className="space-y-2 text-xs text-[#4C1D95] font-medium">
              <li><Link to="/shop" className="hover:text-[#5B21B6] transition-colors">All Products</Link></li>
              <li><Link to="/shop?sortBy=newest" className="hover:text-[#5B21B6] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?sortBy=best_selling" className="hover:text-[#5B21B6] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop?category=women-heels" className="hover:text-[#5B21B6] transition-colors">Heels</Link></li>
              <li><Link to="/shop?category=running-shoes" className="hover:text-[#5B21B6] transition-colors">Sneakers</Link></li>
              <li><Link to="/slippers" className="hover:text-[#5B21B6] transition-colors">Slippers & Boots</Link></li>
            </ul>
          </div>

          {/* HELP Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E0842]">HELP</h4>
            <ul className="space-y-2 text-xs text-[#4C1D95] font-medium">
              <li><a href="#shipping" className="hover:text-[#5B21B6] transition-colors">Shipping and Delivery</a></li>
              <li><a href="#returns" className="hover:text-[#5B21B6] transition-colors">Return & Exchanges</a></li>
              <li><a href="#size" className="hover:text-[#5B21B6] transition-colors">Size Guide</a></li>
              <li><a href="#faqs" className="hover:text-[#5B21B6] transition-colors">FAQs</a></li>
              <li><Link to="/orders" className="hover:text-[#5B21B6] transition-colors">Track Order</Link></li>
              <li><a href="tel:9553536884" className="hover:text-[#5B21B6] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* ABOUT Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E0842]">ABOUT</h4>
            <ul className="space-y-2 text-xs text-[#4C1D95] font-medium">
              <li><a href="#about" className="hover:text-[#5B21B6] transition-colors">About Us</a></li>
              <li><a href="#stores" className="hover:text-[#5B21B6] transition-colors">Our Store</a></li>
              <li><a href="#careers" className="hover:text-[#5B21B6] transition-colors">Careers</a></li>
              <li><a href="#privacy" className="hover:text-[#5B21B6] transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#5B21B6] transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* FOLLOW US & NEWSLETTER (From Reference) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E0842]">FOLLOW US</h4>
            {/* Circular Social Icons in Purple from Reference */}
            <div className="flex items-center gap-2.5">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-black text-xs hover:bg-[#4C1D95] transition-colors shadow-sm"
              >
                f
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-black text-xs hover:bg-[#4C1D95] transition-colors shadow-sm"
              >
                ig
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-black text-xs hover:bg-[#4C1D95] transition-colors shadow-sm"
              >
                tt
              </a>
              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#5B21B6] text-white flex items-center justify-center font-black text-xs hover:bg-[#4C1D95] transition-colors shadow-sm"
              >
                p
              </a>
            </div>

            {/* We Accept Payment Icons from Reference */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#3B0764] block mb-2">We accept</span>
              <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase">
                <span className="px-2.5 py-1 rounded bg-white font-serif tracking-wider shadow-2xs border border-purple-100 text-[#1E0842]">
                  VISA
                </span>
                <span className="px-2.5 py-1 rounded bg-white font-sans tracking-wider shadow-2xs border border-purple-100 text-rose-600">
                  Mastercard
                </span>
                <span className="px-2.5 py-1 rounded bg-white font-sans tracking-wider shadow-2xs border border-purple-100 text-sky-700">
                  PayPal
                </span>
                <span className="px-2.5 py-1 rounded bg-white font-sans tracking-wider shadow-2xs border border-purple-100 text-slate-800">
                  Apple Pay
                </span>
                <span className="px-2.5 py-1 rounded bg-white font-sans tracking-wider shadow-2xs border border-purple-100 text-purple-700">
                  UPI / Razorpay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5B21B6]/80 gap-3">
          <p>© {new Date().getFullYear()} Chandhana Shoe Mart (CSM). All rights reserved.</p>
          <p className="font-serif text-[#3B0764] font-bold text-center">
            పాదరక్షల బృందావనం • Opp: Tata Theatre, Tagarapuvalasa, Andhra Pradesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
