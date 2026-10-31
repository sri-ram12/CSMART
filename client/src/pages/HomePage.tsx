import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { DualPromotionalBanners } from '../components/home/DualPromotionalBanners';
import { ValueFeatureBar } from '../components/home/ValueFeatureBar';
import { TopIndianBrandsBanner } from '../components/home/TopIndianBrandsBanner';
import { TopBrandMarquee } from '../components/common/TopBrandMarquee';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { StoreLocationShowcase } from '../components/home/StoreLocationShowcase';
import { DynamicOfferBanners } from '../components/home/DynamicOfferBanners';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { ShoeViewer3DShowcase } from '../components/home/ShoeViewer3DShowcase';
import { VideoAdsShowcase } from '../components/home/VideoAdsShowcase';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. TOP BRAND BANNER LOGOS SCROLLING ALONG WITH NAME */}
      <TopBrandMarquee />

      {/* 2. Arched Lavender Hero Section with Sneakers & Floating Quick Category Strip */}
      <HeroSection />

      {/* 2.5. Admin Dynamic Promotional Banners & Offers */}
      <DynamicOfferBanners />

      {/* 3. Official Company Brand Banners Showcase (VKC Pride, Walkaroo, Paragon, Sparx, Doctor Choice) */}
      <TopIndianBrandsBanner />

      {/* 3.5. Interactive 3D Shoe Viewer — Popular Brand Flagship Models (Walkaroo, Sparx, VKC Pride, Paragon) */}
      <ShoeViewer3DShowcase />

      {/* 4. Fresh In Store - New Arrivals Section */}
      <NewArrivalsSection />

      {/* 5. BEST SELLERS - 5 Column Row of Authentic Scanned Catalog Footwear */}
      <TrendingCarousel />

      {/* 6. Dual Promotional Banners (Fresh Styles Just In + Get 15% Off) */}
      <DualPromotionalBanners />

      {/* 6. Value Proposition Strip (Free shipping, Easy Returns, Secure Payment, Premium Quality, 24/7 Support) */}
      <ValueFeatureBar />

      {/* 6. In-Store Promotional Video Ads & Brand Reels (Admin Broadcast from Gallery) */}
      <div id="video-reels">
        <VideoAdsShowcase />
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
