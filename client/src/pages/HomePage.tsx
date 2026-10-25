import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { DualPromotionalBanners } from '../components/home/DualPromotionalBanners';
import { ValueFeatureBar } from '../components/home/ValueFeatureBar';
import { TopIndianBrandsBanner } from '../components/home/TopIndianBrandsBanner';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Arched Lavender Hero Section with Sneakers & Floating Quick Category Strip */}
      <HeroSection />

      {/* 2. BEST SELLERS - 5 Column Row of Fur-Lined Winter Boots (Matching Reference Image) */}
      <TrendingCarousel />

      {/* 3. Dual Promotional Banners (Fresh Styles Just In + Get 15% Off) */}
      <DualPromotionalBanners />

      {/* 4. Value Proposition Strip (Free shipping, Easy Returns, Secure Payment, Premium Quality, 24/7 Support) */}
      <ValueFeatureBar />

      {/* 5. Brand Logos Ribbon (Adidas, Puma, Steve Madden, Aldo Outlet, Zara, Converse, New Balance) */}
      <TopIndianBrandsBanner />

      {/* 6. Borderless Pinterest Autoscroll Video Reels Showcase */}
      <div id="video-reels">
        <VideoShowcase />
      </div>

      {/* 7. Customer Reviews & Ratings Section (Direct Target from Categories Drawer) */}
      <div id="customer-reviews">
        <CustomerReviewsSection />
      </div>
    </div>
  );
};

export default HomePage;
