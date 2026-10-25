import React from 'react';
import { Link } from 'react-router-dom';
import referenceBrandsImg from '../../assets/reference_brands.jpg';

export const TopIndianBrandsBanner: React.FC = () => {
  return (
    <section
      aria-label="Official Footwear Brands"
      className="w-full bg-white py-5 sm:py-8 border-none select-none overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full overflow-x-auto scrollbar-none py-1 flex justify-start md:justify-center">
          <Link
            to="/shop"
            className="block min-w-[540px] md:min-w-0 md:w-full max-w-4xl opacity-90 hover:opacity-100 transition-opacity border-none shrink-0"
            title="Explore Brand Collections"
          >
            <img
              src={referenceBrandsImg}
              alt="Official Brands - Adidas, Puma, Steve Madden, Aldo Outlet, Zara, Converse, New Balance"
              className="w-full h-auto object-contain border-none mx-auto block"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopIndianBrandsBanner;
