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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header (Matching Image 1 title) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Select Category
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-none cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          <CategorySelectorContent onSelect={onClose} initialDepartment={initialDepartment} />
        </div>
      </div>
    </div>
  );
};
