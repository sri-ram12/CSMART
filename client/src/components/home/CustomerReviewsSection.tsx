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
    <section className="py-20 bg-slate-50/80 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-xs font-bold text-red-700 border-none">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Testimonials</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Trusted by Walkers, Runners & Professionals
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">4.9 / 5.0</span>
            <span className="text-xs text-slate-500">(Over 50,000+ Verified Customer Ratings)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-3xl bg-white shadow-card flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover relative group border-none"
            >
              <Quote className="w-8 h-8 text-red-100 absolute top-6 right-6 pointer-events-none group-hover:text-red-200 transition-colors" />

              <div className="space-y-4">
                {/* Stars & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              {/* User Profile */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                  <p className="text-[11px] text-slate-500">{r.city}</p>
                  <p className="text-[10px] text-red-600 font-bold mt-0.5">{r.shoe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
