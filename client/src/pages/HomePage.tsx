import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { DualPromotionalBanners } from '../components/home/DualPromotionalBanners';
import { ValueFeatureBar } from '../components/home/ValueFeatureBar';
import { TopIndianBrandsBanner } from '../components/home/TopIndianBrandsBanner';
import { TopBrandMarquee } from '../components/common/TopBrandMarquee';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { StoreLocationShowcase } from '../components/home/StoreLocationShowcase';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. TOP BRAND BANNER LOGOS SCROLLING ALONG WITH NAME */}
      <TopBrandMarquee />

      {/* 2. Arched Lavender Hero Section with Sneakers & Floating Quick Category Strip */}
      <HeroSection />

      {/* 3. Official Company Brand Banners Showcase (Walkaroo 381, Sparx 174, VKC, Paragon) */}
      <TopIndianBrandsBanner />

      {/* 4. BEST SELLERS - 5 Column Row of Authentic Scanned Catalog Footwear */}
      <TrendingCarousel />

      {/* 5. Dual Promotional Banners (Fresh Styles Just In + Get 15% Off) */}
      <DualPromotionalBanners />

      {/* 6. Value Proposition Strip (Free shipping, Easy Returns, Secure Payment, Premium Quality, 24/7 Support) */}
      <ValueFeatureBar />

      {/* 6. High-Definition Footwear Video Highlights Showcase (Manual Scroll & Navigation Controls) */}
      <div id="video-reels">
        <VideoShowcase />
      </div>

      {/* 7. Store Location & Google Maps Showcase with Authentic Shop Photos */}
      <div id="store-location">
        <StoreLocationShowcase />
      </div>

      {/* 8. Customer Reviews & Ratings Section (Direct Target from Categories Drawer) */}
      <div id="customer-reviews">
        <CustomerReviewsSection />
      </div>
    </div>
  );
};

export default HomePage;
