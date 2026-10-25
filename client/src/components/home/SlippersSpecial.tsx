import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Feather, Activity } from 'lucide-react';

export const SlippersSpecial: React.FC = () => {
  const slippersPerks = [
    {
      icon: Feather,
      title: 'Ultralight 120g Density',
      desc: 'Bio-based EVA molding delivering featherweight agility without bottoming out.',
    },
    {
      icon: Activity,
      title: '45mm Cloud Step Sole',
      desc: '30° forward tilt design relieving plantar fascia pressure and Achilles tension.',
    },
    {
      icon: Droplets,
      title: 'Hydro-Channel Anti-Slip',
      desc: 'Siped wave treads expelling standing water instantaneously on wet surfaces.',
    },
    {
      icon: ShieldCheck,
      title: 'Odorless & Anti-Bacterial',
      desc: 'Closed-cell hydrophobic structure preventing bacterial adhesion and sweat odors.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
      {/* Fashion 'Exclusive Offer' Card in Pastel Lavender (#E6D4FB to #D8B4F8) */}
      <section className="relative overflow-hidden rounded-3xl lg:rounded-[40px] bg-gradient-to-br from-[#E6D4FB] via-[#D8B4F8] to-[#C084FC] p-6 sm:p-10 lg:p-14 border border-purple-200 shadow-xl">
        {/* Soft radial ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/40 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column: Visual Slipper Highlight */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden bg-white shadow-xl p-5 sm:p-7 border border-purple-100">
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#5B21B6]">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>CloudStep Exclusive</span>
                </span>
                <span className="text-xs font-serif font-black text-[#5B21B6]">Special Launch ₹699</span>
              </div>

              {/* Slipper Showcase Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7FD] flex items-center justify-center p-4">
                <img
                  src="https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=900&auto=format&fit=crop&q=80"
                  alt="Chandhana CloudStep Ultra-Cushion Slides"
                  className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />

                {/* Sole Thickness Pin */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs text-[#5B21B6] border border-purple-200 font-medium">
                  <span className="font-bold text-[#5B21B6]">4.5cm</span> Thick Cushion Base
                </div>
              </div>

              {/* Color Options Swatches */}
              <div className="flex items-center justify-between mt-4 text-xs font-semibold text-slate-600">
                <span>Available in 6 Pastel Colorways</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#E6D5F7] border border-purple-300 shadow-2xs" />
                  <span className="w-4 h-4 rounded-full bg-[#FAF7FD] border border-slate-300 shadow-2xs" />
                  <span className="w-4 h-4 rounded-full bg-[#3B0764] border border-purple-900 shadow-2xs" />
                  <span className="w-4 h-4 rounded-full bg-[#F5D0C5] border border-rose-200 shadow-2xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & CloudStep Perks */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3 text-center lg:text-left">
              <span className="inline-block bg-white/90 text-[#5B21B6] font-black text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-2xs">
                Slippers & Recovery Spotlight
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E0842] tracking-tight leading-[1.1]">
                Walking on Clouds. <br />
                <span className="font-serif italic font-normal text-[#3B0764]">Every Single Day.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#3B0764] leading-relaxed max-w-xl">
                Engineered with high-rebound injection EVA to cradle tired arches after long shifts, active runs, or relaxing weekends at home.
              </p>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {slippersPerks.map((perk) => {
                const IconComponent = perk.icon;
                return (
                  <div
                    key={perk.title}
                    className="p-3.5 rounded-2xl bg-white/90 shadow-xs border border-white/60 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#5B21B6] shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{perk.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/slippers"
                className="btn-primary text-xs sm:text-sm py-3.5 px-8 font-black tracking-wider uppercase inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all border-none rounded-full"
              >
                <span>Shop Slippers & Sandals</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SlippersSpecial;
