import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { SlippersSpecial } from '../components/home/SlippersSpecial';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { api } from '../services/api';
import { Product } from '../types';
import { MessageCircle, Send, Check } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    api.products
      .getAll({ limit: 12 })
      .then((res) => setProducts(res.products))
      .catch((err) => console.error('Failed to load products', err));
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubscribed(false);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section with Photorealistic 3D Footwear Canvas */}
      <HeroSection />

      {/* 2. Department Category Cards */}
      <CategoryGrid />

      {/* 3. Trending & Featured Products Carousel */}
      <TrendingCarousel products={products} />

      {/* 4. Cinematic Video Demonstration Showcase */}
      <VideoShowcase />

      {/* 5. Dedicated Slippers & Sandals Department Spotlight */}
      <SlippersSpecial />

      {/* 6. Customer Testimonials */}
      <CustomerReviewsSection />

      {/* 7. Newsletter & VIP WhatsApp Club (Clean White & Red Theme) */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-center space-y-6 relative overflow-hidden shadow-xl text-white border-none">
            <div className="max-w-xl mx-auto space-y-3">
              <span className="inline-block bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full backdrop-blur-md">
                Chandhana Club VIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Get ₹500 Off Your First Pair & Exclusive 3D Drops
              </h2>
              <p className="text-xs sm:text-sm text-red-100">
                Subscribe for private invitations to seasonal launches, secret coupon codes, and priority customer care.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white px-4 py-3.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white border-none font-medium shadow-md"
              />
              <button
                type="submit"
                className="border-none bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold py-3 px-6 rounded-xl shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                {newsletterSubscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Joined!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Subscribe
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-red-100">
              <a
                href="https://wa.me/919845012345?text=Hello%20Chandhana%20Shoe%20Mart,%20I%20would%20like%20to%20join%20the%20VIP%20WhatsApp%20club"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white hover:underline font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join VIP WhatsApp Updates</span>
              </a>
              <span>• No Spam Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
