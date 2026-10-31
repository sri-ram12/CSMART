import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '../../types';
import { api } from '../../services/api';
import { Tag, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const DynamicOfferBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.banners
      .getAll()
      .then((data) => {
        setBanners(data || []);
      })
      .catch((err) => {
        console.error('Failed to load offer banners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Auto rotate banners every 5 seconds if multiple
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-purple-100 group">
        {/* Banner Slide */}
        <div
          className="relative min-h-[170px] sm:min-h-[200px] md:min-h-[220px] p-6 sm:p-8 flex flex-col justify-center transition-all duration-500"
          style={{
            backgroundColor: currentBanner.bgColor || '#5B21B6',
            color: currentBanner.textColor || '#FFFFFF',
          }}
        >
          {/* Background Decorative Pattern / Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Optional background image if set */}
          {currentBanner.imageUrl && (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 overflow-hidden pointer-events-none opacity-40 sm:opacity-75">
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-inherit to-transparent" style={{ background: `linear-gradient(to right, ${currentBanner.bgColor || '#5B21B6'} 0%, transparent 100%)` }} />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] sm:text-xs font-black uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Special Storefront Offer</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight drop-shadow-xs">
              {currentBanner.title}
            </h3>

            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm md:text-base font-medium opacity-90 leading-snug drop-shadow-xs">
                {currentBanner.subtitle}
              </p>
            )}

            <div className="pt-2">
              <Link
                to={currentBanner.linkUrl || '/shop'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-slate-100 transition-transform hover:scale-103 cursor-pointer"
              >
                <span>Shop This Offer</span>
                <ArrowRight className="w-4 h-4 text-[#5B21B6]" />
              </Link>
            </div>
          </div>

          {/* Slider Controls (if multiple banners) */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-xs transition cursor-pointer"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-xs transition cursor-pointer"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicOfferBanners;

