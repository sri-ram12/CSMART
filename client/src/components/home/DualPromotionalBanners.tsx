import React from 'react';
import { Link } from 'react-router-dom';
import promoFreshStyles from '../../assets/promo_fresh_styles.jpg';
import promoDiscount15 from '../../assets/promo_discount_15.jpg';

export const DualPromotionalBanners: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-white border-none select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {/* Card 1: NEW ARRIVALS - Fresh Styles Just In */}
          <Link
            to="/shop?sortBy=newest"
            className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-none bg-[#E7D6FB]"
            aria-label="Shop New Arrivals - Fresh Styles Just In"
          >
            <img
              src={promoFreshStyles}
              alt="Fresh Styles Just In - Explore the latest trends"
              className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 border-none block"
            />
          </Link>

          {/* Card 2: special offer - Get 15% Off On Your First Order */}
          <Link
            to="/shop?discount=15"
            className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-none bg-[#E7D6FB]"
            aria-label="Get 15% Off On Your First Order - Use code welcome 15"
          >
            <img
              src={promoDiscount15}
              alt="Get 15% Off On Your First Order - Use code welcome 15"
              className="w-full h-auto object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 border-none block"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DualPromotionalBanners;
