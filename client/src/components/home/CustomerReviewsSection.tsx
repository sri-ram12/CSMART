import React from 'react';
import { Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Vikram Sengupta',
      city: 'Bengaluru, Karnataka',
      shoe: 'Apex Nitro Hyper-Speed Runner',
      rating: 5,
      date: 'Verified Buyer • 4 days ago',
      text: 'The energy return on these running shoes is phenomenal. I run 8km every morning in Cubbon Park and my knees feel zero impact soreness. Plus, being able to inspect the shoe in 3D WebGL on the website before ordering gave me total confidence in the tread pattern.',
    },
    {
      name: 'Priya Narayanan',
      city: 'Mumbai, Maharashtra',
      shoe: 'CloudStep Ultra-Cushion EVA Slides',
      rating: 5,
      date: 'Verified Buyer • 1 week ago',
      text: 'The 4.5cm thick sole is like walking on a supportive mattress. We have glossy bathroom tile that gets slippery, but these grip completely without sliding. Definitely ordering pairs for my parents as well.',
    },
    {
      name: 'Anand Kumar',
      city: 'Delhi NCR',
      shoe: 'Windsor Handcrafted Leather Derby',
      rating: 5,
      date: 'Verified Buyer • 2 weeks ago',
      text: 'Exquisite burnished leather finish. Delivered in a luxurious matte magnetic box with dust bags and cedar horn. Fits true to Indian UK 9 without any heel chafing right out of the box.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7FD] border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-xs font-bold text-[#5B21B6] border-none shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Loved By Thousands
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#5B21B6]">4.9 / 5.0</span>
            <span className="text-xs text-slate-500">(Over 50,000+ Happy Footwear Buyers)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-[28px] bg-white shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative group border-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-purple-200 group-hover:text-purple-300 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-6 border-t border-purple-50 mt-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{r.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6]" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{r.city}</span>
                </div>
                <span className="text-[10px] font-bold text-[#5B21B6] bg-[#EDE9FE] px-2 py-0.5 rounded-full">
                  {r.shoe.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
