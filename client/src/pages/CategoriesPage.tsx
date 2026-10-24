import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { CategorySelectorContent } from '../components/category/CategorySelectorContent';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || 'men';

  return (
    <div className="min-h-screen bg-slate-50 py-2.5 sm:py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Top Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 p-3 sm:p-4 mb-2.5 sm:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border-none cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Select Category
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Explore hand-picked footwear styles across all departments
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Footwear Catalog</span>
          </div>
        </div>

        {/* Content Box with Fluid Viewport Height */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-[calc(100dvh-150px)] sm:h-[600px]">
          <CategorySelectorContent initialDepartment={initialDept} />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
