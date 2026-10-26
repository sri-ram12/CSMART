import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Check, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogos';

export interface SplitFilterState {
  sort: string;
  brands: string[];
  gender: string[];
  category: string[];
  size: string[];
  color: string[];
  minPrice: string;
  maxPrice: string;
  discount: string;
  rating: string;
  smartAssured: boolean;
  ageGroup: string[];
  countryOfOrigin: string[];
  offers: string[];
  newArrivals: string;
}

interface SplitFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SplitFilterState;
  onApplyFilters: (filters: SplitFilterState) => void;
  onClearFilters: () => void;
  totalProductsCount: number;
  availableBrands?: Array<{ name: string; count: number }>;
}

const FILTER_TABS = [
  { id: 'Sort', label: 'Sort' },
  { id: 'Brand', label: 'Brand' },
  { id: 'Gender', label: 'Gender' },
  { id: 'Category', label: 'Category' },
  { id: 'Size', label: 'Size' },
  { id: 'Color', label: 'Color' },
  { id: 'Price', label: 'Price' },
  { id: 'Discount', label: 'Discount' },
  { id: 'Customer Ratings', label: 'Customer Ratings' },
  { id: 'Smart Assured', label: 'Smart Assured' },
  { id: 'Age Group', label: 'Age Group' },
  { id: 'Country Of Origin', label: 'Country Of Origin' },
  { id: 'Offers', label: 'Offers' },
  { id: 'New Arrivals', label: 'New Arrivals' },
];

const POPULAR_BRANDS = [
  'Nike',
  'Puma',
  'Adidas',
  'Skechers',
  'Crocs',
  'Red Tape',
  'Woodland',
  'Bata',
  'Asics',
  'Campus',
  'HRX by Hrithik Roshan',
  'Reebok',
  'Sparx',
  'Relaxo',
  'Red Chief',
  'Metro',
];

const FALLBACK_ALL_BRANDS = [
  { name: 'Sparx', count: 309 },
  { name: 'New Balance', count: 2234 },
  { name: 'Nike', count: 48 },
  { name: 'Puma', count: 42 },
  { name: 'Adidas', count: 36 },
  { name: 'Bata', count: 31 },
  { name: 'Red Tape', count: 28 },
  { name: 'Woodland', count: 24 },
  { name: 'Crocs', count: 20 },
  { name: 'Campus', count: 18 },
  { name: 'Asics', count: 16 },
  { name: 'Skechers', count: 15 },
  { name: 'HRX by Hrithik Roshan', count: 14 },
  { name: 'Reebok', count: 12 },
  { name: 'Relaxo', count: 11 },
  { name: 'Red Chief', count: 9 },
  { name: 'Metro', count: 8 },
];

const CATEGORIES_LIST = [
  { id: 'slippers', label: 'Slippers & Slides' },
  { id: 'sports', label: 'Sports & Running' },
  { id: 'formal', label: 'Formal Shoes' },
  { id: 'loafers', label: 'Casual Loafers' },
  { id: 'boots', label: 'Outdoor Boots' },
  { id: 'sandals', label: 'Ethnic & Floater Sandals' },
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'moulded', label: 'Full Moulded Shoes' },
  { id: 'crocs', label: 'Crocs & Clogs' },
];

const SIZES_LIST = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

const COLORS_LIST = [
  { name: 'Black', hex: '#111827' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Grey', hex: '#64748B' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Tan', hex: '#B45309' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #f43f5e 0%, #3b82f6 100%)' },
];

const PRICE_PRESETS = [
  { label: 'Under ₹999', min: '0', max: '999' },
  { label: '₹1,000 - ₹2,499', min: '1000', max: '2499' },
  { label: '₹2,500 - ₹4,999', min: '2500', max: '4999' },
  { label: '₹5,000+', min: '5000', max: '' },
];

const DISCOUNT_OPTIONS = [
  { label: '50% or more', value: '50' },
  { label: '40% or more', value: '40' },
  { label: '30% or more', value: '30' },
  { label: '20% or more', value: '20' },
  { label: '10% or more', value: '10' },
];

const RATING_OPTIONS = [
  { label: '4★ & above', value: '4' },
  { label: '3★ & above', value: '3' },
  { label: '2★ & above', value: '2' },
];

export const SplitFilterDrawer: React.FC<SplitFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApplyFilters,
  onClearFilters,
  totalProductsCount,
  availableBrands = [],
}) => {
  const [activeTab, setActiveTab] = useState<string>('Brand');
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [draftFilters, setDraftFilters] = useState<SplitFilterState>(initialFilters);

  // Sync draft when opened
  React.useEffect(() => {
    if (isOpen) {
      setDraftFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  // Combine and sort brand list
  const mergedBrands = useMemo(() => {
    const map = new Map<string, number>();
    // Pre-populate with fallback counts
    FALLBACK_ALL_BRANDS.forEach((b) => map.set(b.name.toLowerCase(), b.count));
    // Overwrite with live counts from backend facets if present
    availableBrands.forEach((b) => map.set(b.name.toLowerCase(), b.count));

    const result = Array.from(map.entries()).map(([k, v]) => {
      // Find proper display casing
      const foundPop = POPULAR_BRANDS.find((p) => p.toLowerCase() === k);
      const foundFall = FALLBACK_ALL_BRANDS.find((f) => f.name.toLowerCase() === k);
      const name = foundPop || foundFall?.name || k.toUpperCase();
      return { name, count: v };
    });

    return result.sort((a, b) => b.count - a.count);
  }, [availableBrands]);

  // Filter brands by search keyword
  const filteredBrandsList = useMemo(() => {
    if (!brandSearch.trim()) return mergedBrands;
    const q = brandSearch.toLowerCase().trim();
    return mergedBrands.filter((b) => b.name.toLowerCase().includes(q));
  }, [mergedBrands, brandSearch]);

  const filteredPopularBrands = useMemo(() => {
    if (!brandSearch.trim()) return POPULAR_BRANDS;
    const q = brandSearch.toLowerCase().trim();
    return POPULAR_BRANDS.filter((b) => b.toLowerCase().includes(q));
  }, [brandSearch]);

  if (!isOpen) return null;

  // Toggle helper for multi-value arrays
  const toggleArrayItem = (key: keyof SplitFilterState, value: string) => {
    setDraftFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleClearAll = () => {
    const empty: SplitFilterState = {
      sort: 'recommended',
      brands: [],
      gender: [],
      category: [],
      size: [],
      color: [],
      minPrice: '',
      maxPrice: '',
      discount: '',
      rating: '',
      smartAssured: false,
      ageGroup: [],
      countryOfOrigin: [],
      offers: [],
      newArrivals: '',
    };
    setDraftFilters(empty);
    onClearFilters();
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  // Helper to check if a tab has active selections
  const getTabActiveCount = (tabId: string): number => {
    switch (tabId) {
      case 'Brand':
        return draftFilters.brands.length;
      case 'Gender':
        return draftFilters.gender.length;
      case 'Category':
        return draftFilters.category.length;
      case 'Size':
        return draftFilters.size.length;
      case 'Color':
        return draftFilters.color.length;
      case 'Price':
        return draftFilters.minPrice || draftFilters.maxPrice ? 1 : 0;
      case 'Discount':
        return draftFilters.discount ? 1 : 0;
      case 'Customer Ratings':
        return draftFilters.rating ? 1 : 0;
      case 'Smart Assured':
        return draftFilters.smartAssured ? 1 : 0;
      case 'Age Group':
        return draftFilters.ageGroup.length;
      case 'Country Of Origin':
        return draftFilters.countryOfOrigin.length;
      case 'Offers':
        return draftFilters.offers.length;
      case 'New Arrivals':
        return draftFilters.newArrivals ? 1 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Drawer Shell (Aligned to LEFT SIDE ONLY - Image 2 reference) */}
      <div className="relative w-full sm:max-w-xl h-full bg-white flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-250">
        {/* HEADER: Matching Image 2 (<- Filters       Clear All Filters) */}
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors border-none cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black text-slate-900 tracking-tight">Filters</h2>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer"
          >
            Clear All Filters
          </button>
        </header>

        {/* BODY: Split 2-Column Layout */}
        <div className="flex-1 flex flex-row overflow-hidden min-h-0">
          {/* LEFT COLUMN: Vertical Tabs List (Image 2) */}
          <aside className="w-24 min-[360px]:w-28 sm:w-36 md:w-40 bg-slate-50 border-r border-slate-200/80 flex flex-col overflow-y-auto shrink-0 select-none no-scrollbar">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = getTabActiveCount(tab.id);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full text-left px-2 min-[360px]:px-2.5 sm:px-4 py-3 sm:py-3.5 text-[11px] sm:text-xs font-semibold transition-all border-none cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-white text-blue-600 font-black'
                      : 'text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  {/* Left Blue Indicator Bar when active (Image 2 reference) */}
                  {isActive && (
                    <span className="absolute left-0 inset-y-0 w-1 bg-blue-600 rounded-r-sm" />
                  )}

                  <span className="truncate pr-1 leading-tight">{tab.label}</span>

                  {count > 0 && (
                    <span className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 rounded-full bg-blue-600 text-white text-[8px] min-[360px]:text-[9px] font-black flex items-center justify-center shrink-0">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* RIGHT COLUMN: Tab Content Panel (Image 2) */}
          <main className="flex-1 min-w-0 bg-white overflow-y-auto p-2.5 sm:p-4 md:p-5">
            {/* 1. BRAND TAB (IMAGE 2 PRIMARY VIEW) */}
            {activeTab === 'Brand' && (
              <div className="space-y-4 sm:space-y-5">
                {/* Search across brands (Image 2) */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search across brands"
                    className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Popular Brands (Image 2 3-Column Logo Cards) */}
                {filteredPopularBrands.length > 0 && (
                  <div>
                    <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-wider mb-2 sm:mb-3">
                      Popular Brands
                    </h3>
                    <div className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-1.5 sm:gap-2.5">
                      {filteredPopularBrands.map((b) => {
                        const isSelected = draftFilters.brands.includes(b);

                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => toggleArrayItem('brands', b)}
                            className={`relative flex flex-col items-center justify-center p-1.5 min-[360px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            {/* Selected Checkmark Badge */}
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 stroke-[3]" />
                              </div>
                            )}

                            {/* Brand Logo Vector */}
                            <div className="h-6 min-[360px]:h-7 sm:h-8 flex items-center justify-center text-slate-800 w-full px-1">
                              <BrandLogo brand={b} className="max-h-6 sm:max-h-7 max-w-full" />
                            </div>

                            {/* Brand Name Text below logo */}
                            <span className="mt-1 sm:mt-1.5 text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-extrabold text-slate-800 uppercase tracking-tight text-center truncate max-w-full">
                              {b}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Brands (Image 2 Checkbox list with Counts) */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    All Brands
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {filteredBrandsList.map((b) => {
                      const isSelected = draftFilters.brands.includes(b.name);

                      return (
                        <label
                          key={b.name}
                          className="flex items-center justify-between py-2 sm:py-2.5 cursor-pointer hover:bg-slate-50/60 px-1 rounded-lg transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleArrayItem('brands', b.name)}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 shrink-0"
                            />
                            <span
                              className={`text-xs truncate ${
                                isSelected ? 'font-bold text-blue-600' : 'font-medium text-slate-800'
                              }`}
                            >
                              {b.name}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 shrink-0">
                            {b.count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SORT TAB */}
            {activeTab === 'Sort' && (
              <div className="space-y-1">
                {[
                  { value: 'recommended', label: 'Popularity' },
                  { value: 'price_asc', label: 'Price -- Low to High' },
                  { value: 'price_desc', label: 'Price -- High to Low' },
                  { value: 'rating_desc', label: 'Customer Rating' },
                  { value: 'newest', label: 'Newest First' },
                  { value: 'best_selling', label: 'Best Discount & Offers' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <span
                      className={`text-xs ${
                        draftFilters.sort === opt.value
                          ? 'font-black text-blue-600'
                          : 'font-medium text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      name="sortRadio"
                      value={opt.value}
                      checked={draftFilters.sort === opt.value}
                      onChange={() => setDraftFilters((prev) => ({ ...prev, sort: opt.value }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            )}

            {/* 3. GENDER TAB */}
            {activeTab === 'Gender' && (
              <div className="space-y-2">
                {[
                  { id: 'MEN', label: 'Men' },
                  { id: 'WOMEN', label: 'Women' },
                  { id: 'BOYS', label: 'Boys' },
                  { id: 'GIRLS', label: 'Girls' },
                  { id: 'KIDS', label: 'Kids & Teens' },
                ].map((g) => {
                  const isChecked = draftFilters.gender.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('gender', g.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800">{g.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* 4. CATEGORY TAB */}
            {activeTab === 'Category' && (
              <div className="space-y-2">
                {CATEGORIES_LIST.map((cat) => {
                  const isChecked = draftFilters.category.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('category', cat.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800">{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* 5. SIZE TAB */}
            {activeTab === 'Size' && (
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  India / UK Shoe Size
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES_LIST.map((sz) => {
                    const isSelected = draftFilters.size.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleArrayItem('size', sz)}
                        className={`py-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. COLOR TAB */}
            {activeTab === 'Color' && (
              <div className="space-y-2">
                {COLORS_LIST.map((c) => {
                  const isChecked = draftFilters.color.includes(c.name);
                  return (
                    <label
                      key={c.name}
                      className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                          style={{ background: c.hex }}
                        />
                        <span className="text-xs font-bold text-slate-800">{c.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('color', c.name)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                    </label>
                  );
                })}
              </div>
            )}

            {/* 7. PRICE TAB */}
            {activeTab === 'Price' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                    Price Presets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_PRESETS.map((p) => {
                      const isSelected =
                        draftFilters.minPrice === p.min && draftFilters.maxPrice === p.max;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              minPrice: p.min,
                              maxPrice: p.max,
                            }))
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    Custom Range (₹)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">
                        MIN ₹
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={draftFilters.minPrice}
                        onChange={(e) =>
                          setDraftFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">
                        MAX ₹
                      </span>
                      <input
                        type="number"
                        placeholder="10000"
                        value={draftFilters.maxPrice}
                        onChange={(e) =>
                          setDraftFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. DISCOUNT TAB */}
            {activeTab === 'Discount' && (
              <div className="space-y-1">
                {DISCOUNT_OPTIONS.map((d) => (
                  <label
                    key={d.value}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <span
                      className={`text-xs ${
                        draftFilters.discount === d.value
                          ? 'font-black text-blue-600'
                          : 'font-medium text-slate-700'
                      }`}
                    >
                      {d.label}
                    </span>
                    <input
                      type="radio"
                      name="discountRadio"
                      value={d.value}
                      checked={draftFilters.discount === d.value}
                      onChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          discount: prev.discount === d.value ? '' : d.value,
                        }))
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            )}

            {/* 9. CUSTOMER RATINGS TAB */}
            {activeTab === 'Customer Ratings' && (
              <div className="space-y-1">
                {RATING_OPTIONS.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs ${
                          draftFilters.rating === r.value
                            ? 'font-black text-blue-600'
                            : 'font-medium text-slate-700'
                        }`}
                      >
                        {r.label}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <input
                      type="radio"
                      name="ratingRadio"
                      value={r.value}
                      checked={draftFilters.rating === r.value}
                      onChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          rating: prev.rating === r.value ? '' : r.value,
                        }))
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            )}

            {/* 10. SMART ASSURED TAB (F-Assured in Image 2) */}
            {activeTab === 'Smart Assured' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-black text-slate-900">
                      Smart Assured Products Only
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftFilters.smartAssured}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({ ...prev, smartAssured: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Products undergo 6-step quality inspection, genuine brand warranty, and fast priority dispatch.
                </p>
              </div>
            )}

            {/* 11. AGE GROUP TAB */}
            {activeTab === 'Age Group' && (
              <div className="space-y-2">
                {['Adults', 'Teens (13-18)', 'Kids (4-12)', 'Infants & Toddlers'].map((age) => (
                  <label
                    key={age}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={draftFilters.ageGroup.includes(age)}
                      onChange={() => toggleArrayItem('ageGroup', age)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800">{age}</span>
                  </label>
                ))}
              </div>
            )}

            {/* 12. COUNTRY OF ORIGIN TAB */}
            {activeTab === 'Country Of Origin' && (
              <div className="space-y-2">
                {['India', 'Vietnam', 'Indonesia', 'Germany', 'USA'].map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={draftFilters.countryOfOrigin.includes(c)}
                      onChange={() => toggleArrayItem('countryOfOrigin', c)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800">{c}</span>
                  </label>
                ))}
              </div>
            )}

            {/* 13. OFFERS TAB */}
            {activeTab === 'Offers' && (
              <div className="space-y-2">
                {[
                  'Special Price',
                  'Buy More Save More',
                  'Festival Sale Discount',
                  'Bank Cashback Available',
                ].map((offer) => (
                  <label
                    key={offer}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={draftFilters.offers.includes(offer)}
                      onChange={() => toggleArrayItem('offers', offer)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-800">{offer}</span>
                  </label>
                ))}
              </div>
            )}

            {/* 14. NEW ARRIVALS TAB */}
            {activeTab === 'New Arrivals' && (
              <div className="space-y-2">
                {[
                  { value: 'last_7_days', label: 'Last 7 Days' },
                  { value: 'last_30_days', label: 'Last 30 Days' },
                  { value: 'season_latest', label: 'Current Season Fresh Drop' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                    <input
                      type="radio"
                      name="newArrivalsRadio"
                      value={opt.value}
                      checked={draftFilters.newArrivals === opt.value}
                      onChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          newArrivals: prev.newArrivals === opt.value ? '' : opt.value,
                        }))
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* BOTTOM STICKY ACTION BAR: Matching Image 2 ("See 50000+ products" full width blue button) */}
        <footer className="p-2.5 sm:p-3.5 border-t border-slate-200 bg-white shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wide shadow-md shadow-blue-500/25 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <span>See {totalProductsCount}+ products</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
