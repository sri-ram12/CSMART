import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const PinCodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.pincode.check(pincode.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to check PIN code availability.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white shadow-sm border-none space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
        <MapPin className="w-4 h-4 text-red-600" />
        <span>Check Delivery Availability & Estimated Date</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit PIN code (e.g. 560001)"
          className="flex-1 bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || pincode.length !== 6}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl border-none shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Check
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="text-xs space-y-1.5 pt-3 border-t border-slate-100 text-slate-700">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Delivers to {result.city}</span>
          </div>
          <div className="text-slate-800">
            Estimated Delivery:{' '}
            <span className="font-extrabold text-red-600">{result.estimatedDelivery}</span> (
            {result.courier})
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            <span>• Cash on Delivery: Available</span>
            <span>• 7-Day Doorstep Replacement</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinCodeChecker;
