import React, { useState } from 'react';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface QualitySpecsProps {
  product: Product;
}

export const QualitySpecs: React.FC<QualitySpecsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'specs' | 'care'>('materials');

  const specs = [
    { label: 'Upper Material', val: product.upperMaterial || 'Engineered Breathable Textile / Leather' },
    { label: 'Outsole Material', val: product.soleMaterial || 'Multi-Density High-Abrasion Rubber' },
    { label: 'Insole Cushioning', val: product.insoleMaterial || 'Molded High-Rebound Foam Insole' },
    { label: 'Cushioning Technology', val: product.cushioning || 'Responsive Nitrogen / EVA Foam' },
    { label: 'Closure Mechanism', val: product.closureType || 'Ergonomic Lacing' },
    { label: 'Heel Stack / Drop', val: product.heelHeight || 'Standard Drop (10mm)' },
    { label: 'Shoe Weight', val: product.weight || 'Approx 240g (Standard Size)' },
    { label: 'Traction / Grip Pattern', val: product.gripType || 'Multi-directional chevron rubber lugs' },
  ];

  return (
    <div className="rounded-2xl bg-white shadow-sm border-none p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Quality, Construction & Technical Specifications
          </h3>
        </div>
      </div>

      {/* Tabs - borderless buttons with underline indicator */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-2.5 text-xs font-bold transition-all border-none relative cursor-pointer ${
            activeTab === 'materials'
              ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Material Breakdown
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-2.5 text-xs font-bold transition-all border-none relative cursor-pointer ${
            activeTab === 'specs'
              ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Key Specifications
        </button>
        <button
          onClick={() => setActiveTab('care')}
          className={`pb-2.5 text-xs font-bold transition-all border-none relative cursor-pointer ${
            activeTab === 'care'
              ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Care & Warranty
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-1.5 hover:bg-red-50/40 transition-colors">
            <span className="text-[11px] text-red-600 font-bold uppercase tracking-wider">
              Upper Architecture
            </span>
            <p className="text-sm font-bold text-slate-900">{product.upperMaterial || 'Engineered Mesh & Overlays'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">Offers targeted lateral lockdown with high air permeability.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-1.5 hover:bg-red-50/40 transition-colors">
            <span className="text-[11px] text-red-600 font-bold uppercase tracking-wider">
              Sole & Tread Composition
            </span>
            <p className="text-sm font-bold text-slate-900">{product.soleMaterial || 'Anti-Slip Compound'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">Specially formulated for high grip on asphalt, gym floors, and tiles.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-1.5 hover:bg-red-50/40 transition-colors">
            <span className="text-[11px] text-red-600 font-bold uppercase tracking-wider">
              Insole Comfort Bed
            </span>
            <p className="text-sm font-bold text-slate-900">{product.insoleMaterial || 'High-Density Memory Latex'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">Conforms to foot arch contours to prevent fatigue during extended wear.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-1.5 hover:bg-red-50/40 transition-colors">
            <span className="text-[11px] text-red-600 font-bold uppercase tracking-wider">
              Cushioning Platform
            </span>
            <p className="text-sm font-bold text-slate-900">{product.cushioning || 'Shock Absorption Midsole'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">Absorbs peak ground impact forces to protect joints and knees.</p>
          </div>
        </div>
      )}

      {activeTab === 'specs' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {specs.map((s, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border-none hover:bg-red-50/40 transition-colors">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {s.label}
              </div>
              <div className="text-slate-900 font-extrabold mt-1">{s.val}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'care' && (
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              Cleaning & Maintenance Instructions
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.careInstructions ||
                'Wipe clean using a soft, damp cloth with mild soap. Allow footwear to air dry at room temperature away from direct sunlight or artificial heaters. For suede or leather, use specialized brushes and polish.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border-none space-y-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-600" />
              Warranty & Guarantee
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.warranty ||
                'Covered by Chandhana Shoe Mart 6-Month Manufacturer Warranty against sole debonding, stitching defects, and upper structural flaws under normal footwear usage.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualitySpecs;
