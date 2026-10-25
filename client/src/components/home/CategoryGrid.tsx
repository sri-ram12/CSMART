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
    <section className="py-14 sm:py-20 bg-[#FAF7FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header styled in lavender luxury tone */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-xs font-bold text-[#5B21B6] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Tailored For Every Step</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Curated Departments
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore specialized footwear collections designed for comfort, athletic energy, and enduring craftsmanship.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B21B6] hover:text-[#4C1D95] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Large Department Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.title}
              to={dept.link}
              className={`group relative h-96 sm:h-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-500 flex flex-col justify-end p-6 border-none ${
                dept.highlight
                  ? 'ring-2 ring-[#7C3AED] ring-offset-2'
                  : ''
              }`}
            >
              {/* Background Cover Image with Hover Zoom */}
              <img
                src={dept.image}
                alt={dept.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                    dept.highlight
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-white/90 text-slate-800 backdrop-blur-md'
                  }`}
                >
                  {dept.badge}
                </span>
              </div>

              {/* Department Content */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-purple-200 transition-colors drop-shadow">
                  {dept.title}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
                  {dept.subtitle}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-200 group-hover:text-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
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
