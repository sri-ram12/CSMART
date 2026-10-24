import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { Shoe3DViewer } from '../components/3d/Shoe3DViewer';

export const SlippersPage: React.FC = () => {
  const [slippers, setSlippers] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.products.getAll({ department: 'SLIPPERS_SANDALS', limit: 50 }),
      api.products.getAll({ category: 'sandals-wedges', limit: 30 }),
      api.products.getAll({ category: 'kolhapuri-ethnic', limit: 30 }),
      api.products.getAll({ category: 'memory-foam-slippers', limit: 30 }),
    ])
      .then(([deptRes, cat1, cat2, cat3]) => {
        const combined = [...deptRes.products, ...cat1.products, ...cat2.products, ...cat3.products];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setSlippers(unique);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const subcategories = [
    { id: 'ALL', label: 'All Slippers & Sandals' },
    { id: 'eva-slides-flip-flops', label: 'CloudStep EVA Slides' },
    { id: 'memory-foam-slippers', label: 'Memory Foam Slippers' },
    { id: 'adjustable-strap-sandals', label: 'All-Terrain Sandals' },
    { id: 'sandals-wedges', label: 'Wedges & Strappy Sandals' },
    { id: 'kolhapuri-ethnic', label: 'Kolhapuri Ethnic Chappals' },
  ];

  const filtered = slippers.filter((s) => {
    if (selectedSubcategory === 'ALL') return true;
    return s.category?.slug === selectedSubcategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Department Hero Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-rose-700 p-8 sm:p-12 shadow-xl border-none text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block bg-white/20 text-white font-extrabold uppercase tracking-wider text-[11px] px-3 py-1 rounded-full border-none">
                Dedicated Footwear Department
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Slippers, Flip-Flops & Ergonomic Sandals
              </h1>
              <p className="text-xs sm:text-sm text-red-50 leading-relaxed max-w-xl">
                Engineered with bio-elastic EVA foam, 45mm platform shock absorption, and siped wave outsoles. Designed specifically for Indian home flooring, wet bathrooms, and all-weather casual mobility.
              </p>

              {/* Technical badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border-none">
                  <div className="text-white font-black text-lg">45mm</div>
                  <div className="text-[10px] text-red-100 font-medium">Pillow Sole</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border-none">
                  <div className="text-white font-black text-lg">Zero-Slip</div>
                  <div className="text-[10px] text-red-100 font-medium">Wet Tile Grip</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border-none">
                  <div className="text-white font-black text-lg">120g</div>
                  <div className="text-[10px] text-red-100 font-medium">Featherweight</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border-none">
                  <div className="text-white font-black text-lg">30° Tilt</div>
                  <div className="text-[10px] text-red-100 font-medium">Ergonomic Arch</div>
                </div>
              </div>
            </div>

            {/* Interactive 3D Model Showcase */}
            <div className="lg:col-span-5 relative bg-white/10 backdrop-blur-md rounded-3xl p-3 border-none">
              <Shoe3DViewer
                primaryColor="#DC2626"
                accentColor="#FFFFFF"
                soleColor="#F8FAFC"
                height="h-[340px]"
                modelType="comfort_slide"
              />
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs - borderless buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pb-2">
          {subcategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubcategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                selectedSubcategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 sm:h-80 rounded-2xl sm:rounded-3xl bg-white shadow-sm animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl shadow-sm border-none">
              <p className="text-sm text-slate-500 font-medium">No footwear in this subcategory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlippersPage;
