import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import {
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States from URL or defaults
  const currentDepartment = searchParams.get('department') || 'ALL';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sortBy') || 'recommended';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentHas3D = searchParams.get('has3D') === 'true';
  const currentInStock = searchParams.get('inStock') === 'true';

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const params: Record<string, any> = {
      sortBy: currentSort,
      limit: 24,
    };
    if (currentDepartment !== 'ALL') params.department = currentDepartment;
    if (currentCategory) params.category = currentCategory;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentSize) params.size = currentSize;
    if (currentColor) params.color = currentColor;
    if (currentHas3D) params.has3D = true;
    if (currentInStock) params.inStock = true;

    api.products
      .getAll(params)
      .then((res) => {
        setProducts(res.products);
        setTotalCount(res.pagination.total);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [
    currentDepartment,
    currentCategory,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentSize,
    currentColor,
    currentHas3D,
    currentInStock,
  ]);

  const updateFilter = (key: string, value: string | boolean | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const departments = [
    { id: 'ALL', label: 'All Departments' },
    { id: 'MEN', label: "Men's Footwear" },
    { id: 'WOMEN', label: "Women's Footwear" },
    { id: 'KIDS', label: "Kids' Footwear" },
    { id: 'SLIPPERS_SANDALS', label: 'Slippers & Sandals' },
  ];

  const availableSizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 4', 'UK 5'];

  const availableColors = [
    { name: 'Red', hex: '#DC2626' },
    { name: 'Navy', hex: '#1D3557' },
    { name: 'Black', hex: '#111827' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Green', hex: '#2D6A4F' },
    { name: 'Tan', hex: '#3D1C06' },
  ];

  const hasActiveFilters =
    currentDepartment !== 'ALL' ||
    Boolean(currentCategory) ||
    Boolean(currentSize) ||
    Boolean(currentColor) ||
    currentHas3D ||
    currentInStock ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice);

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumbs */}
        <div className="pb-8 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {currentDepartment === 'MEN'
                ? "Men's Footwear Collection"
                : currentDepartment === 'WOMEN'
                ? "Women's Footwear Collection"
                : currentDepartment === 'KIDS'
                ? "Kids' Footwear Collection"
                : currentDepartment === 'SLIPPERS_SANDALS'
                ? 'Slippers & Sandals Department'
                : 'All Footwear Collection'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <span className="text-red-600 font-bold">{totalCount}</span> genuine handcrafted styles
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle (BORDERLESS) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="border-none lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-sm text-xs font-bold text-slate-800"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-600" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white shadow-sm rounded-xl px-3.5 py-2 text-xs border-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-red-600 mr-2 shrink-0" />
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-4 border-none"
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest Additions</option>
                <option value="best_selling">Best Selling</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="py-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold mr-1">Active Filters:</span>
            {currentDepartment !== 'ALL' && (
              <span className="badge-red">
                Dept: {currentDepartment}{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('department', 'ALL')}
                />
              </span>
            )}
            {currentCategory && (
              <span className="badge-red">
                Category: {currentCategory}{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('category', null)}
                />
              </span>
            )}
            {currentSize && (
              <span className="badge-red">
                Size: {currentSize}{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('size', null)}
                />
              </span>
            )}
            {currentColor && (
              <span className="badge-red">
                Color: {currentColor}{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('color', null)}
                />
              </span>
            )}
            {currentHas3D && (
              <span className="badge-red">
                3D Interactive{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('has3D', null)}
                />
              </span>
            )}
            {currentInStock && (
              <span className="badge-red">
                In Stock Only{' '}
                <X
                  className="w-3 h-3 cursor-pointer ml-1 text-red-600"
                  onClick={() => updateFilter('inStock', null)}
                />
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="border-none text-xs text-red-600 font-bold hover:underline ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="p-6 rounded-3xl bg-white shadow-card space-y-6 border-none">
              {/* Department Selector */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Department
                </h4>
                <div className="space-y-1.5">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => updateFilter('department', dept.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border-none ${
                        currentDepartment === dept.id
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{dept.label}</span>
                      {currentDepartment === dept.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Model Only Filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={currentHas3D}
                    onChange={(e) => updateFilter('has3D', e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>3D Models Only</span>
                  </span>
                </label>
              </div>

              {/* In Stock Only Filter */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={currentInStock}
                    onChange={(e) => updateFilter('inStock', e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>

              {/* Size Selector Chips (BORDERLESS) */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Filter by Size (India/UK)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', currentSize === s ? null : s)}
                      className={`border-none py-2 text-xs font-bold rounded-xl text-center transition-all ${
                        currentSize === s
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Colorway
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateFilter('color', currentColor === c.name ? null : c.name)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        currentColor === c.name
                          ? 'border-red-600 scale-125 shadow-md shadow-red-500/25 ring-2 ring-red-200'
                          : 'border-slate-200 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Price (₹ INR)
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={currentMinPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-1/2 bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 border-none font-medium"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={currentMaxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-1/2 bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 border-none font-medium"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 sm:h-80 rounded-2xl sm:rounded-3xl bg-white shadow-sm animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-white rounded-3xl shadow-card space-y-3">
                <Sparkles className="w-12 h-12 text-red-500/50 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No products found matching filters</h3>
                <p className="text-xs text-slate-500">
                  Try clearing active size, price, or color filters to see more results.
                </p>
                <button onClick={clearAllFilters} className="btn-primary text-xs py-2.5 px-6 mt-2">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
