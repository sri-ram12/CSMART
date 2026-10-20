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
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white via-red-50/20 to-white border-t border-slate-100">
      {/* Background ambient red glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Slipper Highlight */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl p-6 sm:p-8 border-none ring-1 ring-slate-100">
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="badge-red">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Dedicated Department</span>
                </span>
                <span className="text-xs font-black text-red-600">₹699 Special Launch</span>
              </div>

              {/* Slipper Showcase Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                <img
                  src="https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=900&auto=format&fit=crop&q=80"
                  alt="Chandhana CloudStep Ultra-Cushion Slides"
                  className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />

                {/* Sole Thickness Pin */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs text-slate-800 border-none font-medium">
                  <span className="text-red-600 font-bold">4.5cm</span> Thick Cushion Base
                </div>

                {/* Water Resistance Pin */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md text-xs text-slate-800 flex items-center gap-1.5 border-none font-medium">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  <span>100% Waterproof</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Available Sizes: UK 6 to UK 11</span>
                <span className="text-emerald-600 font-bold">• In Stock (Ready to Ship)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-xs font-bold text-red-700 border-none">
              <span>Slippers, Slides & Sandals Department</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              CloudStep Recovery & Anti-Slip Comfort Slides
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              We dedicated an entire engineering division to perfecting domestic and outdoor slippers. Whether you require orthopedic arch cradling for tile floors, quick-drying bathroom grip, or poolside memory foam, our CloudStep collection delivers unrivaled step relief.
            </p>

            {/* Feature Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {slippersPerks.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white shadow-sm border-none space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{p.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link to="/slippers" className="btn-primary text-xs font-extrabold py-3.5 px-7">
                <span>Explore Slippers Department</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/product/chandhana-cloudstep-ultra-cushion-slides" className="btn-secondary text-xs font-extrabold py-3.5 px-7">
                <span>Inspect in 3D WebGL</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlippersSpecial;
