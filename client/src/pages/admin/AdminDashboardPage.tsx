import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  AlertTriangle,
  Settings,
  ShieldAlert,
  ArrowRight,
  QrCode,
  MessageCircle,
  Clock,
  Sparkles,
  Phone,
  User,
  Film,
} from 'lucide-react';
import { ShareQRModal } from '../../components/common/ShareQRModal';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQROpen, setIsQROpen] = useState(false);

  useEffect(() => {
    api.admin
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-purple-200/60 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#5B21B6] text-white border-none shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5" /> Operations Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight">
              Chandhana Shoe Mart Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              WhatsApp customer enquiries, 560 catalog styles, offers &amp; shop inventory
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-xs font-bold text-slate-700 hover:text-[#5B21B6] shadow-xs border border-purple-100 transition-all flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-[#7C3AED]" />
              <span>Catalog &amp; Offers</span>
            </Link>
            <Link
              to="/admin/enquiries"
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 shadow-xs border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp Enquiries</span>
            </Link>
            <Link
              to="/admin/inventory"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-xs font-bold text-slate-700 hover:text-[#5B21B6] shadow-xs border border-purple-100 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Inventory</span>
            </Link>
            <Link
              to="/admin/video-ads"
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-[#5B21B6] shadow-xs border border-purple-200 transition-all flex items-center gap-1.5"
            >
              <Film className="w-4 h-4 text-[#7C3AED]" />
              <span>Video Ads</span>
            </Link>
            <Link
              to="/admin/settings"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-xs font-bold text-slate-700 hover:text-[#5B21B6] shadow-xs border border-purple-100 transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsQROpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-[#5B21B6] shadow-xs border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Store QR Standee & Sharing"
            >
              <QrCode className="w-4 h-4 text-[#7C3AED]" />
              <span>Store QR</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-3xl bg-white shadow-xs animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* WhatsApp Enquiries */}
            <div className="p-5 rounded-3xl bg-white shadow-xs border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>WhatsApp Enquiries</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {stats?.totalEnquiries ?? 5}
              </div>
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {stats?.newEnquiries ?? 2} Awaiting Reply
              </p>
            </div>

            {/* Catalog Footwear Styles */}
            <div className="p-5 rounded-3xl bg-white shadow-xs border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Catalog Footwear</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats?.productsCount || 560}</div>
              <p className="text-[11px] text-[#5B21B6] font-medium">Styles across 18 Brands</p>
            </div>

            {/* Converted Shop Sales */}
            <div className="p-5 rounded-3xl bg-white shadow-xs border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Purchased Leads</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#5B21B6]">
                {stats?.convertedEnquiries ?? 1}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Converted Store Trials</p>
            </div>

            {/* Low Stock Alerts */}
            <div className="p-5 rounded-3xl bg-white shadow-xs border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Low Stock Variants</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-600">
                {stats?.lowStockVariants || 0}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Less than 5 pairs in warehouse</p>
            </div>
          </div>
        )}

        {/* Recent WhatsApp Customer Inquiries Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-xs border border-purple-100 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Recent WhatsApp Customer Product Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customers reaching out from the catalog to check prices, sizes and availability
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-[#5B21B6] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7FD] text-slate-700 uppercase font-bold text-[11px] border-b border-purple-100">
                <tr>
                  <th className="py-3 px-3.5">Customer Lead</th>
                  <th className="py-3 px-3.5">Product Enquired</th>
                  <th className="py-3 px-3.5">Message / Requirement</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(stats?.recentEnquiries || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No recent customer enquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  (stats?.recentEnquiries || []).map((enq: any) => {
                    const cleanPhone = (enq.phone || '').replace(/\D/g, '');
                    const waUrl = cleanPhone
                      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                          `Hello ${enq.customerName || 'Sir/Madam'}, thank you for contacting Chandhana Shoe Mart Tagarapuvalasa!`
                        )}`
                      : null;

                    return (
                      <tr key={enq.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-slate-900 block text-xs">
                            {enq.customerName || 'Store Visitor'}
                          </span>
                          {enq.phone ? (
                            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                              +91 {enq.phone}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Web click</span>
                          )}
                          <span className="text-[10px] text-slate-400 block">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </td>

                        <td className="py-3.5 px-3.5">
                          <span className="font-bold text-slate-900 block text-xs">
                            {enq.productTitle || 'Footwear Style'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {enq.brand && (
                              <span className="text-[9px] font-black uppercase text-[#5B21B6] bg-purple-50 px-1.5 py-0.2 rounded">
                                {enq.brand}
                              </span>
                            )}
                            {enq.sku && (
                              <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                #{enq.sku}
                              </span>
                            )}
                            {enq.price && (
                              <span className="text-[10px] font-black text-slate-800">
                                ₹{enq.price}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3.5 max-w-xs">
                          <p className="text-xs text-slate-600 line-clamp-2 italic">
                            "{enq.message}"
                          </p>
                        </td>

                        <td className="py-3.5 px-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-block ${
                              enq.status === 'NEW'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                : enq.status === 'CONTACTED'
                                ? 'bg-sky-50 text-sky-800 border border-sky-300'
                                : enq.status === 'CONVERTED'
                                ? 'bg-purple-50 text-purple-800 border border-purple-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {enq.status === 'NEW'
                              ? '🟢 New'
                              : enq.status === 'CONTACTED'
                              ? '🔵 Contacted'
                              : enq.status === 'CONVERTED'
                              ? '🟣 Purchased'
                              : 'Closed'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {waUrl ? (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition"
                                title="Reply on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                <span>Reply</span>
                              </a>
                            ) : null}

                            <Link
                              to="/admin/enquiries"
                              className="text-xs font-bold text-[#5B21B6] hover:underline"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ShareQRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
    </div>
  );
};

export default AdminDashboardPage;
