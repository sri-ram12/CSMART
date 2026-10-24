import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const departments = [
    {
      title: "Men's Collection",
      subtitle: 'Running Shoes, Suede Sneakers & Formal Derbies',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      link: '/shop?department=MEN',
      badge: 'Popular',
    },
    {
      title: "Women's Collection",
      subtitle: 'Performance Trainers, Chic Flats & Wedges',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      link: '/shop?department=WOMEN',
      badge: 'Trending',
    },
    {
      title: 'Dedicated Slippers & Sandals',
      subtitle: 'CloudStep EVA Slides, Memory Foam & Bathroom Footwear',
      image: 'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=800&auto=format&fit=crop&q=80',
      link: '/slippers',
      badge: 'CloudStep Special',
      highlight: true,
    },
    {
      title: "Kids' Collection",
      subtitle: 'Playground-Proof School Shoes & LED Sneakers',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
      link: '/shop?department=KIDS',
      badge: 'Durable',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored For Every Step</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Footwear Departments
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Department Cards Grid (Responsive 2-column mobile, 4-column desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.title}
              to={dept.link}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden h-52 min-[380px]:h-60 sm:h-72 lg:h-[360px] flex flex-col justify-end p-3.5 sm:p-5 lg:p-6 transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover border-none ${
                dept.highlight ? 'ring-2 ring-red-500 shadow-glow' : ''
              }`}
            >
              {/* Background Image with Dark Vignette for Crisp Contrast */}
              <img
                src={dept.image}
                alt={dept.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badge */}
              <div className="relative z-10 mb-auto">
                <span
                  className={`inline-block text-[9px] sm:text-[10px] uppercase font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md border-none ${
                    dept.highlight
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white/90 text-red-600 shadow-sm'
                  }`}
                >
                  {dept.badge}
                </span>
              </div>

              {/* Text Info */}
              <div className="relative z-10 space-y-1 sm:space-y-2">
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white group-hover:text-red-400 transition-colors leading-tight">
                  {dept.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-200 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                  {dept.subtitle}
                </p>

                <div className="pt-1 sm:pt-2 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
