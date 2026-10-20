import React from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  department = 'MEN',
}) => {
  if (!isOpen) return null;

  const menSizes = [
    { uk: 'UK 6', eu: 'EU 40', us: 'US 7', cm: '24.5 cm' },
    { uk: 'UK 7', eu: 'EU 41', us: 'US 8', cm: '25.5 cm' },
    { uk: 'UK 8', eu: 'EU 42', us: 'US 9', cm: '26.5 cm' },
    { uk: 'UK 9', eu: 'EU 43', us: 'US 10', cm: '27.5 cm' },
    { uk: 'UK 10', eu: 'EU 44', us: 'US 11', cm: '28.5 cm' },
    { uk: 'UK 11', eu: 'EU 45', us: 'US 12', cm: '29.5 cm' },
  ];

  const womenSizes = [
    { uk: 'UK 3', eu: 'EU 36', us: 'US 5', cm: '22.0 cm' },
    { uk: 'UK 4', eu: 'EU 37', us: 'US 6', cm: '23.0 cm' },
    { uk: 'UK 5', eu: 'EU 38', us: 'US 7', cm: '24.0 cm' },
    { uk: 'UK 6', eu: 'EU 39', us: 'US 8', cm: '25.0 cm' },
    { uk: 'UK 7', eu: 'EU 40', us: 'US 9', cm: '25.5 cm' },
  ];

  const kidSizes = [
    { uk: 'Kids 10', eu: 'EU 28', us: 'US 11K', cm: '17.0 cm' },
    { uk: 'Kids 11', eu: 'EU 29', us: 'US 12K', cm: '18.0 cm' },
    { uk: 'Kids 12', eu: 'EU 30', us: 'US 13K', cm: '19.0 cm' },
    { uk: 'Kids 13', eu: 'EU 31', us: 'US 1', cm: '20.0 cm' },
    { uk: 'UK 1', eu: 'EU 32', us: 'US 2', cm: '20.5 cm' },
  ];

  const activeSizes =
    department === 'WOMEN' ? womenSizes : department === 'KIDS' ? kidSizes : menSizes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border-none rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Footwear Sizing & Measurement Guide</h3>
              <p className="text-xs text-slate-500">Standard Indian & UK foot dimensions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors border-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Indian footwear sizes directly follow standard UK sizing conventions. For maximum accuracy, measure your foot length in centimeters using the instructions below.
          </p>

          {/* Size Table */}
          <div className="overflow-x-auto rounded-2xl border-none shadow-sm ring-1 ring-slate-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-red-50 text-red-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">India / UK</th>
                  <th className="py-3 px-4">Euro (EU)</th>
                  <th className="py-3 px-4">US Size</th>
                  <th className="py-3 px-4">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeSizes.map((row) => (
                  <tr key={row.uk} className="hover:bg-red-50/40 transition-colors">
                    <td className="py-2.5 px-4 font-extrabold text-slate-900">{row.uk}</td>
                    <td className="py-2.5 px-4">{row.eu}</td>
                    <td className="py-2.5 px-4">{row.us}</td>
                    <td className="py-2.5 px-4 text-red-600 font-bold">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Step-by-Step */}
          <div className="p-4 rounded-2xl bg-slate-50 border-none space-y-2">
            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-600" /> How to Measure Your Foot Length:
            </h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Place a sheet of blank A4 paper on a hard floor against a wall.</li>
              <li>Stand on the paper with your heel firmly touching the wall.</li>
              <li>Mark the furthest point of your longest toe with a pencil held vertically.</li>
              <li>Measure the distance from the edge of the paper to the marked line in centimeters.</li>
              <li>If you are between two sizes, we recommend ordering the larger size for optimal comfort.</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="btn-primary text-xs py-2.5 px-7 border-none shadow-md cursor-pointer">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
