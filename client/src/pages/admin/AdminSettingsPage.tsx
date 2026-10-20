import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StoreSettings } from '../../types';
import { ArrowLeft, Save, Plus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // New coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState('PERCENTAGE');
  const [couponValue, setCouponValue] = useState('');
  const [minOrder, setMinOrder] = useState('999');

  const loadSettingsAndCoupons = async () => {
    try {
      const [sData, cData] = await Promise.all([
        api.admin.getSettings(),
        api.admin.getCoupons(),
      ]);
      setSettings(sData);
      setCoupons(cData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSettingsAndCoupons();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.admin.updateSettings(settings);
      setSaveMsg('Store settings updated successfully!');
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon({
        code: couponCode.trim().toUpperCase(),
        discountType: couponType,
        value: parseFloat(couponValue),
        minOrderValue: parseFloat(minOrder) || 0,
      });
      setCouponCode('');
      setCouponValue('');
      loadSettingsAndCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <Link to="/admin" className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-red-600 shadow-sm ring-1 ring-slate-200 border-none transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Store Configuration & Coupons</h1>
            <p className="text-xs text-slate-500 font-medium">Delivery thresholds, policies, contact info, and promotional vouchers</p>
          </div>
        </div>

        {saveMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-xs text-emerald-700 font-bold flex items-center gap-2 border-none">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            General Store & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Storefront Name</label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Customer Care Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-slate-700 font-bold">Showroom Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-slate-700 font-bold">Top Announcement Banner</label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Free Express Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button type="submit" className="btn-primary text-xs font-bold py-3 px-7 flex items-center gap-1.5 border-none shadow-md cursor-pointer">
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>

        {/* Coupons Section */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
            Promotional Coupons & Vouchers
          </h3>

          {/* Create coupon form */}
          <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs items-end">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 uppercase font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Discount Type</label>
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-bold"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Fixed (₹)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold">Discount Value</label>
              <input
                type="number"
                required
                placeholder="e.g. 10 or 500"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-bold"
              />
            </div>

            <button type="submit" className="btn-primary py-3 text-xs font-bold flex items-center justify-center gap-1 border-none shadow-md cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Create Coupon
            </button>
          </form>

          {/* Existing coupons table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Discount</th>
                  <th className="py-2.5 px-3">Min Order</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">{c.code}</td>
                    <td className="py-2.5 px-3 font-medium">
                      {c.discountType === 'PERCENTAGE' ? `${c.value}% Off` : `₹${c.value} Flat Off`}
                    </td>
                    <td className="py-2.5 px-3 font-medium">₹{c.minOrderValue}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border-none">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
