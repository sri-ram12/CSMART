import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SplitFilterDrawer, SplitFilterState } from '../components/shop/SplitFilterDrawer';
import { SelectCategoryModal } from '../components/category/SelectCategoryModal';
import { CompanyBrandBanners } from '../components/common/CompanyBrandBanners';
import {
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [facets, setFacets] = useState<{
    brands: Array<{ name: string; count: number }>;
    categories: Array<{ slug: string; name: string; count: number }>;
    departments: Record<string, number>;
    priceRange: { min: number; max: number };
    totalProducts: number;
  } | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  // Modals state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Filter States from URL
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const currentDepartment = searchParams.get('department') || 'ALL';
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sortBy') || 'recommended';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';
  const currentColor = searchParams.get('color') || '';
  const currentDiscount = searchParams.get('discount') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentHas3D = searchParams.get('has3D') === 'true';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentSearch = searchParams.get('search') || '';

  // Load categories and facets
  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(console.error);
    api.products.getFacets().then(setFacets).catch(console.error);
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    setIsLoading(true);
    const params: Record<string, any> = {
      sortBy: currentSort,
      page: currentPage,
      limit: 24,
    };
    if (currentDepartment !== 'ALL') params.department = currentDepartment;
    if (currentCategory) params.category = currentCategory;
    if (currentBrand) params.brand = currentBrand;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentSize) params.size = currentSize;
    if (currentColor) params.color = currentColor;
    if (currentDiscount) params.discount = currentDiscount;
    if (currentRating) params.rating = currentRating;
    if (currentHas3D) params.has3D = true;
    if (currentInStock) params.inStock = true;
    if (currentSearch) params.search = currentSearch;

    api.products
      .getAll(params)
      .then((res) => {
        setProducts(res.products);
        setTotalCount(res.pagination.total);
        setTotalPages(res.pagination.totalPages || 1);
        setIsFallback(Boolean((res.pagination as any)?.isFallback));
        setFallbackMessage((res.pagination as any)?.fallbackMessage || null);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [
    currentPage,
    currentDepartment,
    currentCategory,
    currentBrand,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentSize,
    currentColor,
    currentDiscount,
    currentRating,
    currentHas3D,
    currentInStock,
    currentSearch,
  ]);

  const updateFilter = (key: string, value: string | boolean | null) => {
    const next = new URLSearchParams(searchParams);
    if (key !== 'page') {
      next.delete('page');
    }
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

  const handlePageChange = (page: number) => {
    updateFilter('page', String(page));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Convert URL searchParams to SplitFilterState
  const currentSplitFilterState: SplitFilterState = {
    sort: currentSort,
    brands: currentBrand ? currentBrand.split(',').filter(Boolean) : [],
    gender:
      currentDepartment && currentDepartment !== 'ALL'
        ? currentDepartment.split(',').filter(Boolean)
        : [],
    category: currentCategory ? currentCategory.split(',').filter(Boolean) : [],
    size: currentSize ? currentSize.split(',').filter(Boolean) : [],
    color: currentColor ? currentColor.split(',').filter(Boolean) : [],
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    discount: currentDiscount,
    rating: currentRating,
    smartAssured: currentInStock,
    ageGroup: [],
    countryOfOrigin: [],
    offers: [],
    newArrivals: '',
  };

  // Apply filters from SplitFilterDrawer (Image 2)
  const handleApplySplitFilters = (newState: SplitFilterState) => {
    const next = new URLSearchParams();

    if (newState.sort && newState.sort !== 'recommended') {
      next.set('sortBy', newState.sort);
    }
    if (newState.brands.length > 0) {
      next.set('brand', newState.brands.join(','));
    }
    if (newState.gender.length > 0) {
      next.set('department', newState.gender.join(','));
    }
    if (newState.category.length > 0) {
      next.set('category', newState.category.join(','));
    }
    if (newState.size.length > 0) {
      next.set('size', newState.size.join(','));
    }
    if (newState.color.length > 0) {
      next.set('color', newState.color.join(','));
    }
    if (newState.minPrice) {
      next.set('minPrice', newState.minPrice);
    }
    if (newState.maxPrice) {
      next.set('maxPrice', newState.maxPrice);
    }
    if (newState.discount) {
      next.set('discount', newState.discount);
    }
    if (newState.rating) {
      next.set('rating', newState.rating);
    }
    if (newState.smartAssured) {
      next.set('inStock', 'true');
    }
    if (currentSearch) {
      next.set('search', currentSearch);
    }
    if (currentHas3D) {
      next.set('has3D', 'true');
    }

    setSearchParams(next);
  };

  const hasActiveFilters =
    currentDepartment !== 'ALL' ||
    Boolean(currentCategory) ||
    Boolean(currentBrand) ||
    Boolean(currentSize) ||
    Boolean(currentColor) ||
    Boolean(currentDiscount) ||
    Boolean(currentRating) ||
    currentHas3D ||
    currentInStock ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    Boolean(currentSearch);

  // Departments for desktop filter pill bar
  const departments = [
    { id: 'ALL', label: 'All' },
    { id: 'MEN', label: 'Men' },
    { id: 'WOMEN', label: 'Women' },
    { id: 'KIDS', label: 'Kids' },
    { id: 'SLIPPERS_SANDALS', label: 'Slippers & Sandals' },
  ];

  return (
    <div className="min-h-screen py-3 sm:py-6 bg-slate-50">
      {/* 1. Official Company Branded Banners Scrolling at the Top */}
      <CompanyBrandBanners
        variant="shop"
        currentBrand={currentBrand}
        onSelectBrand={(b) => updateFilter('brand', currentBrand === b ? null : b)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumbs */}
        <div className="pb-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Footwear Catalog
              </span>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 border-none bg-transparent cursor-pointer p-0"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Browse Categories (Image 1)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
              Showing <span className="text-rose-600 font-bold">{totalCount}</span> genuine handcrafted styles
              {totalPages > 1 && (
                <span className="text-slate-400 ml-2">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </p>
          </div>

          {/* Controls: "Select Category" button + "Filters" button + Sort dropdown */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Image 1 Category Selector Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-600 shadow-xs text-xs font-bold border border-slate-200 hover:border-rose-200 transition-all cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Categories</span>
            </button>

            {/* Image 2 Split Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span>
                Filters {hasActiveFilters && `(${[
                  currentBrand,
                  currentDepartment !== 'ALL',
                  currentCategory,
                  currentSize,
                  currentColor,
                  currentMinPrice || currentMaxPrice,
                ].filter(Boolean).length})`}
              </span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex-1 sm:flex-initial flex items-center bg-white shadow-xs rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs border border-slate-200 justify-between">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 mr-1.5 shrink-0" />
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1 border-none text-xs w-full"
              >
                <option value="recommended">Popularity</option>
                <option value="discount_desc">Highest Discount % (Best Deals)</option>
                <option value="price_asc">Price: Low-High</option>
                <option value="price_desc">Price: High-Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="best_selling">Best Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Department Quick Tabs Bar */}
        <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200/50">
          {departments.map((dept) => {
            const isSelected = currentDepartment === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => updateFilter('department', dept.id === 'ALL' ? null : dept.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border-none cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="py-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold mr-1">Active:</span>

            {currentSearch && (
              <span className="badge-red flex items-center gap-1">
                Search: &ldquo;{currentSearch}&rdquo;
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('search', null)}
                />
              </span>
            )}

            {currentBrand && (
              <span className="badge-red flex items-center gap-1">
                Brand: {currentBrand}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('brand', null)}
                />
              </span>
            )}

            {currentDepartment !== 'ALL' && (
              <span className="badge-red flex items-center gap-1">
                Dept: {currentDepartment}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('department', 'ALL')}
                />
              </span>
            )}

            {currentCategory && (
              <span className="badge-red flex items-center gap-1">
                Cat: {currentCategory}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('category', null)}
                />
              </span>
            )}

            {currentSize && (
              <span className="badge-red flex items-center gap-1">
                Size: {currentSize}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('size', null)}
                />
              </span>
            )}

            {currentColor && (
              <span className="badge-red flex items-center gap-1">
                Color: {currentColor}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('color', null)}
                />
              </span>
            )}

            {currentDiscount && (
              <span className="badge-red flex items-center gap-1">
                {currentDiscount}%+ Off
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('discount', null)}
                />
              </span>
            )}

            {currentRating && (
              <span className="badge-red flex items-center gap-1">
                {currentRating}★ & above
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('rating', null)}
                />
              </span>
            )}

            {currentHas3D && (
              <span className="badge-red flex items-center gap-1">
                360° Models Only
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('has3D', null)}
                />
              </span>
            )}

            {currentInStock && (
              <span className="badge-red flex items-center gap-1">
                In Stock / Assured
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => updateFilter('inStock', null)}
                />
              </span>
            )}

            {(currentMinPrice || currentMaxPrice) && (
              <span className="badge-red flex items-center gap-1">
                ₹{currentMinPrice || '0'} - ₹{currentMaxPrice || 'Max'}
                <X
                  className="w-3 h-3 cursor-pointer text-red-600"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('minPrice');
                    next.delete('maxPrice');
                    setSearchParams(next);
                  }}
                />
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="border-none text-xs text-rose-600 font-bold hover:underline ml-1 cursor-pointer bg-transparent"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="pt-4">
          {/* Smart Fallback Notification */}
          {isFallback && !isLoading && products.length > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {fallbackMessage || (
                    <>
                      Showing all available styles matching <strong>"{currentCategory || 'your criteria'}"</strong> across our store collection.
                    </>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-amber-700 underline hover:text-amber-900 border-none bg-transparent cursor-pointer ml-2 shrink-0"
              >
                Clear Filters
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 sm:h-80 rounded-2xl sm:rounded-3xl bg-white shadow-sm animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-white rounded-3xl shadow-sm border border-slate-100 space-y-4 my-8 max-w-lg mx-auto">
              <Sparkles className="w-12 h-12 text-rose-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  No products found matching filters
                </h3>
                <p className="text-xs text-slate-500">
                  Try clearing selected brand, size, price, or category filters to explore all 555 authentic footwear styles.
                </p>
              </div>

              {/* Quick Brand Recovery Suggestions */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Explore In-Stock Authentic Brands:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('brand', 'Walkaroo');
                      next.delete('page');
                      setSearchParams(next);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-colors cursor-pointer"
                  >
                    Walkaroo (381 styles)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('brand', 'Sparx');
                      next.delete('page');
                      setSearchParams(next);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors cursor-pointer"
                  >
                    Sparx (174 styles)
                  </button>
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="btn-primary text-xs py-2.5 px-6 border-none cursor-pointer mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {(currentPage - 1) * 24 + 1} -{' '}
                    {Math.min(currentPage * 24, totalCount)} of {totalCount} styles
                  </span>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-700 shadow-sm border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                      })
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        const hasGap = prev && p - prev > 1;

                        return (
                          <React.Fragment key={p}>
                            {hasGap && <span className="px-1 text-slate-400 text-xs">...</span>}
                            <button
                              onClick={() => handlePageChange(p)}
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                                currentPage === p
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-rose-600 border-slate-200 shadow-sm'
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-rose-600 disabled:opacity-40 disabled:hover:text-slate-700 shadow-sm border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image 2 Split Filter Drawer */}
      <SplitFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={currentSplitFilterState}
        onApplyFilters={handleApplySplitFilters}
        onClearFilters={clearAllFilters}
        totalProductsCount={totalCount}
        availableBrands={facets?.brands || []}
      />

      {/* Image 1 Select Category Modal */}
      <SelectCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialDepartment={currentDepartment !== 'ALL' ? currentDepartment.toLowerCase() : 'men'}
      />
    </div>
  );
};

export default ShopPage;
