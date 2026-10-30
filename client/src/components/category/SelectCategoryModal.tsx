import React from 'react';
import { X, Layers } from 'lucide-react';
import { CategorySelectorContent } from './CategorySelectorContent';

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDepartment?: string;
}

export const SelectCategoryModal: React.FC<SelectCategoryModalProps> = ({
  isOpen,
  onClose,
  initialDepartment = 'men',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Shell from the LEFT SIDE (Matching Picture 1) */}
      <div className="relative w-[90vw] sm:max-w-md md:max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Header: Matching Picture 1 (Select Category) */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Select Category
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Body: Split 2-Column CategorySelectorContent */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <CategorySelectorContent onSelect={onClose} initialDepartment={initialDepartment} />
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryModal;
