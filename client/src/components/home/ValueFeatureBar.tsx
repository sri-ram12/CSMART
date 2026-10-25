import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award, Headphones } from 'lucide-react';

export const ValueFeatureBar: React.FC = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 text-[#7C3AED]" />,
      title: 'Free shipping',
      subtitle: 'On order over $100',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-[#7C3AED]" />,
      title: 'Easy Returns',
      subtitle: 'Within 30 days',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#7C3AED]" />,
      title: 'Secure Payment',
      subtitle: '100% protected',
    },
    {
      icon: <Award className="w-6 h-6 text-[#7C3AED]" />,
      title: 'Premium Quality',
      subtitle: 'stylish & durable',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#7C3AED]" />,
      title: '24/7 support',
      subtitle: "We're here to help",
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#FAF7FD] border-none select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className={`flex items-center gap-3.5 ${
                idx === 4 ? 'col-span-2 sm:col-span-1 justify-center lg:justify-start' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-[#5B21B6] shadow-xs flex items-center justify-center shrink-0 border-none">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueFeatureBar;
