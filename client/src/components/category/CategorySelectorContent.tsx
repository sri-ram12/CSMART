import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Percent, SlidersHorizontal } from 'lucide-react';

export interface DepartmentItem {
  id: string;
  name: string;
  badge: string;
  photoUrl: string;
  queryDept: string;
}

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  deptSlugs?: Record<string, string>;
}

export const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'men',
    name: 'Men',
    badge: 'MEN',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    queryDept: 'MEN',
  },
  {
    id: 'women',
    name: 'Women',
    badge: 'WOMEN',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    queryDept: 'WOMEN',
  },
  {
    id: 'boys',
    name: 'Boys - Kids',
    badge: 'BOY',
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80',
    queryDept: 'KIDS',
  },
  {
    id: 'girls',
    name: 'Girls - Kids',
    badge: 'GIRL',
    photoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300&auto=format&fit=crop&q=80',
    queryDept: 'KIDS',
  },
];

export const SUBCATEGORIES: SubcategoryItem[] = [
  {
    id: 'slippers',
    name: 'Slippers',
    slug: 'slippers',
    imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-slippers',
      women: 'womens-slippers',
      boys: 'kids-slippers',
      girls: 'kids-slippers',
    },
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-running-shoes',
      women: 'womens-running-trainers',
      boys: 'kids-sports-shoes',
      girls: 'kids-sports-shoes',
    },
  },
  {
    id: 'formals',
    name: 'Formals',
    slug: 'formals',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-formal-shoes',
      women: 'womens-heels-pumps',
      boys: 'kids-school-shoes',
      girls: 'kids-school-shoes',
    },
  },
  {
    id: 'loafers',
    name: 'Loafers',
    slug: 'loafers',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-casual-loafers',
      women: 'womens-flats-loafers',
      boys: 'kids-loafers',
      girls: 'kids-loafers',
    },
  },
  {
    id: 'boots',
    name: 'Boots',
    slug: 'boots',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-boots-outdoor',
      women: 'womens-boots',
      boys: 'kids-boots',
      girls: 'kids-boots',
    },
  },
  {
    id: 'sandals',
    name: 'Sandals',
    slug: 'sandals',
    imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-ethnic-sandals',
      women: 'sandals-wedges',
      boys: 'kids-sandals',
      girls: 'kids-sandals',
    },
  },
  {
    id: 'sneakers',
    name: 'Sneakers',
    slug: 'sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-sneakers',
      women: 'womens-casual-sneakers',
      boys: 'kids-casual-sneakers',
      girls: 'kids-casual-sneakers',
    },
  },
  {
    id: 'full_moulded',
    name: 'Full Moulded Shoes',
    slug: 'moulded-shoes',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-moulded-shoes',
      women: 'womens-moulded-shoes',
      boys: 'kids-moulded-shoes',
      girls: 'kids-moulded-shoes',
    },
  },
  {
    id: 'crocks',
    name: 'Crocks',
    slug: 'crocs',
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&auto=format&fit=crop&q=80',
    deptSlugs: {
      men: 'mens-crocs-clogs',
      women: 'womens-crocs-clogs',
      boys: 'kids-crocs-clogs',
      girls: 'kids-crocs-clogs',
    },
  },
];

interface CategorySelectorContentProps {
  onSelect?: () => void;
  initialDepartment?: string;
}

export const CategorySelectorContent: React.FC<CategorySelectorContentProps> = ({
  onSelect,
  initialDepartment = 'men',
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDepartment);
  const navigate = useNavigate();

  const activeDept = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];

  const handleSubcategoryClick = (sub: SubcategoryItem) => {
    const slug = sub.deptSlugs?.[activeDept.id] || sub.slug;
    const searchUrl = `/shop?department=${activeDept.queryDept}&category=${slug}`;
    if (onSelect) onSelect();
    navigate(searchUrl);
  };

  return (
    <div className="flex flex-row w-full h-full min-h-0 bg-white select-none overflow-hidden">
      {/* LEFT COLUMN: Department Navigation (Fluid responsive width) */}
      <aside className="w-20 min-[375px]:w-24 sm:w-28 md:w-32 bg-slate-50/90 border-r border-slate-100 flex flex-col py-2.5 sm:py-3 px-1 sm:px-1.5 space-y-1.5 sm:space-y-2 shrink-0 overflow-y-auto no-scrollbar">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDeptId === dept.id;

          return (
            <div key={dept.id} className="relative w-full">
              <button
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`w-full flex flex-col items-center p-1 sm:p-1.5 rounded-xl sm:rounded-2xl transition-all border-none cursor-pointer group text-center ${
                  isSelected
                    ? 'bg-rose-50/80 shadow-xs ring-1 ring-rose-200'
                    : 'bg-transparent hover:bg-slate-100/70'
                }`}
              >
                {/* Model Portrait Card */}
                <div
                  className={`relative w-13 h-13 min-[375px]:w-15 min-[375px]:h-15 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs transition-transform duration-200 ${
                    isSelected ? 'ring-2 ring-rose-500 scale-102' : 'group-hover:scale-102'
                  }`}
                >
                  <img
                    src={dept.photoUrl}
                    alt={dept.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  {/* Dark pill badge at bottom of photo (Image 1 reference) */}
                  <div className="absolute inset-x-0.5 bottom-0.5 sm:inset-x-1 sm:bottom-1 bg-black/75 backdrop-blur-xs rounded-full py-0.5 text-center">
                    <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-white uppercase block leading-none">
                      {dept.badge}
                    </span>
                  </div>
                </div>

                {/* Department Label */}
                <span
                  className={`mt-1 sm:mt-1.5 text-[10px] min-[375px]:text-[11px] sm:text-xs font-bold leading-tight line-clamp-1 ${
                    isSelected ? 'text-rose-600 font-black' : 'text-slate-700'
                  }`}
                >
                  {dept.name}
                </span>
              </button>

              {/* Orange/Rose Triangular Arrow Notch Pointing to Right Panel (Image 1 reference) */}
              {isSelected && (
                <div className="absolute -right-[6px] sm:-right-[7px] top-1/2 -translate-y-1/2 z-10 w-0 h-0 border-y-[5px] sm:border-y-[6px] border-y-transparent border-l-[6px] sm:border-l-[7px] border-l-rose-500" />
              )}
            </div>
          );
        })}

        {/* Quick Links: Customer Reviews & Ratings + Offers (All categories mentioned up to reviews) */}
        <div className="pt-2 border-t border-slate-200/80 space-y-1.5 w-full">
          {/* Reviews & Ratings */}
          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect();
              const el = document.getElementById('customer-reviews');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/#customer-reviews');
              }
            }}
            className="w-full flex flex-col items-center p-1 sm:p-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 transition-colors border-none cursor-pointer text-center group shadow-2xs"
            title="Customer Reviews & Ratings (4.9 ★)"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-100 group-hover:bg-amber-200 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <span className="mt-1 text-[9px] sm:text-[10px] font-black text-amber-900 leading-tight">
              Reviews
            </span>
            <span className="text-[7.5px] font-black text-amber-600">4.9 ★</span>
          </button>

          {/* Offers & Discounts */}
          <button
            type="button"
            onClick={() => {
              if (onSelect) onSelect();
              navigate('/shop?discount=15');
            }}
            className="w-full flex flex-col items-center p-1 sm:p-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 transition-colors border-none cursor-pointer text-center group shadow-2xs"
            title="Offers & Discounts (15% OFF)"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-100 group-hover:bg-purple-200 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="mt-1 text-[9px] sm:text-[10px] font-black text-purple-900 leading-tight">
              Offers
            </span>
            <span className="text-[7.5px] font-black text-purple-600">15% OFF</span>
          </button>
        </div>
      </aside>

      {/* RIGHT COLUMN: Subcategory Grid (Fluid responsive 2-column or 3-column) */}
      <section className="flex-1 min-w-0 p-2.5 sm:p-4 md:p-5 overflow-y-auto bg-white flex flex-col justify-start">
        <div className="mb-2 sm:mb-3 flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 truncate">
            {activeDept.name} Footwear
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 shrink-0">
            9 Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3.5">
          {SUBCATEGORIES.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => handleSubcategoryClick(sub)}
              className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-100 hover:border-slate-200 group text-center cursor-pointer shadow-xs hover:shadow-sm"
            >
              {/* Soft circular container for footwear cutout */}
              <div className="w-16 h-16 min-[375px]:w-18 min-[375px]:h-18 sm:w-22 sm:h-22 rounded-full bg-slate-50 flex items-center justify-center p-1.5 sm:p-2 group-hover:bg-rose-50/50 transition-colors">
                <img
                  src={sub.imageUrl}
                  alt={sub.name}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Subcategory Name */}
              <span className="mt-1.5 sm:mt-2 text-[10px] min-[375px]:text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-2 leading-tight">
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
