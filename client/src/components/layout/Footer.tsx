import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/70 text-slate-600 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights Banner (Clean White & Soft Red Glow) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-100">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 hover:bg-red-50/40 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Express Shipping</h4>
              <p className="text-xs text-slate-500">On all orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 hover:bg-red-50/40 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Genuine Footwear</h4>
              <p className="text-xs text-slate-500">Direct from certified artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 hover:bg-red-50/40 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Easy 7-Day Exchange</h4>
              <p className="text-xs text-slate-500">Hassle-free size replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 hover:bg-red-50/40 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Secure Razorpay & COD</h4>
              <p className="text-xs text-slate-500">Encrypted payments & UPI</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-md shadow-red-500/20">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current">
                  <path d="M15 65 Q 38 78 78 55 Q 90 42 80 32 Q 62 38 46 52 Q 28 60 15 65 Z" />
                  <circle cx="72" cy="28" r="5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-lg text-slate-900">CHANDHANA</span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-black text-red-600">
                  SHOE MART
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Established with an obsession for craftsmanship and ergonomic comfort. From nitrogen-infused performance runners to hand-burnished luxury leathers and cloud-soft recovery slides.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>No. 42, Commercial Street, Shivaji Nagar, Bengaluru, Karnataka 560001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <a href="tel:+919845012345" className="hover:text-red-600 transition-colors">
                  +91 98450 12345 / 080-25598124
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href="mailto:support@chandhanashoemart.com" className="hover:text-red-600 transition-colors">
                  support@chandhanashoemart.com
                </a>
              </div>
            </div>
          </div>

          {/* Footwear Departments */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Departments
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?department=MEN" className="hover:text-red-600 transition-colors">
                  Men's Running Shoes
                </Link>
              </li>
              <li>
                <Link to="/shop?department=MEN" className="hover:text-red-600 transition-colors">
                  Men's Casual Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?department=MEN" className="hover:text-red-600 transition-colors">
                  Handcrafted Formal Derbies
                </Link>
              </li>
              <li>
                <Link to="/shop?department=WOMEN" className="hover:text-red-600 transition-colors">
                  Women's Performance Trainers
                </Link>
              </li>
              <li>
                <Link to="/shop?department=WOMEN" className="hover:text-red-600 transition-colors">
                  Women's Pointed Flats
                </Link>
              </li>
              <li>
                <Link to="/shop?department=KIDS" className="hover:text-red-600 transition-colors">
                  Kids' School & PT Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Slippers & Sandals Specialty */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span>Slippers & Slides</span>
              <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.2 rounded-full font-bold">
                Special
              </span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/slippers" className="hover:text-red-600 transition-colors font-semibold text-red-600">
                  CloudStep 45mm Slides
                </Link>
              </li>
              <li>
                <Link to="/slippers" className="hover:text-red-600 transition-colors">
                  Memory Foam Indoor Slippers
                </Link>
              </li>
              <li>
                <Link to="/slippers" className="hover:text-red-600 transition-colors">
                  Anti-Slip Bathroom Flip-Flops
                </Link>
              </li>
              <li>
                <Link to="/slippers" className="hover:text-red-600 transition-colors">
                  TerraGrip All-Terrain Sandals
                </Link>
              </li>
              <li>
                <Link to="/slippers" className="hover:text-red-600 transition-colors">
                  Poolside & Beach Slides
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/orders" className="hover:text-red-600 transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-red-600 transition-colors">
                  Customer Profile & Addresses
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919845012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors flex items-center gap-1 font-semibold text-red-600"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Assistance</span>
                </a>
              </li>
              <li>
                <span className="text-slate-500">Authenticity Guarantee</span>
              </li>
              <li>
                <span className="text-slate-500">Size Chart & Measurement Guide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Chandhana Shoe Mart. All Rights Reserved. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 inline text-red-500 fill-current" /> for footwear enthusiasts.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 mr-2">Secure Payments:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700">
              Razorpay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700">
              UPI / QR
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700">
              RuPay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700">
              Visa / MC
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-red-100 text-[10px] font-bold text-red-600">
              COD Available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
