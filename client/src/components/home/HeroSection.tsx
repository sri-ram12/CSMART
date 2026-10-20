import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Shoe3DViewer } from '../3d/Shoe3DViewer';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-mesh-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Copy & BORDERLESS CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-xs font-bold text-red-700 shadow-sm border-none">
              <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Chandhana Shoe Mart • Grand 2026 Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.1]">
              Step Into Style with{' '}
              <span className="red-gradient-text block mt-1">
                Chandhana Shoe Mart.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover supreme footwear craftsmanship blending athletic nitrogen responsiveness, hand-burnished luxury leathers, and cloud-soft ergonomic recovery slides designed for Indian lifestyles.
            </p>

            {/* BORDERLESS CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/shop" className="btn-primary w-full sm:w-auto text-sm font-extrabold px-8 py-4">
                <span>Shop Full Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/slippers" className="btn-secondary w-full sm:w-auto text-sm font-extrabold px-7 py-4">
                <span>CloudStep Slippers</span>
              </Link>
            </div>

            {/* Social Proof & Metrics */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-slate-900">50K+</div>
                <div className="text-[11px] text-slate-500 font-medium">Happy Walkers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-red-600 flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-4 h-4 fill-current inline text-amber-500" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Average Rating</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">Genuine Craft</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity 3D Sneaker Canvas */}
          <div className="lg:col-span-6 relative">
            {/* Ambient soft red glow back-plate */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/15 to-rose-500/10 rounded-3xl filter blur-3xl -z-10" />

            <div className="relative">
              <Shoe3DViewer
                primaryColor="#DC2626"
                accentColor="#FFFFFF"
                soleColor="#F8FAFC"
                height="h-[340px] sm:h-[440px] lg:h-[520px]"
              />

              {/* Floating feature pill */}
              <div className="absolute -bottom-4 right-3 sm:right-6 left-3 sm:left-auto bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3 z-20 border-none">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-black text-xs shadow-sm shrink-0">
                  3D
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900">Interactive 360° Inspection</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500">Rotate • Zoom • Switch Colorways</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
