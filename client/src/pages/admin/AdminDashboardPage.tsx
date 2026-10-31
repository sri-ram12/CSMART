import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Settings,
  ShieldAlert,
  ArrowRight,
  QrCode,
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
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 border-none">
                <ShieldAlert className="w-3.5 h-3.5" /> Operations Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">
              Storefront Management & Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Live orders, inventory balances, and catalog administration
            </p>
          </div>

          {/* Quick Nav Links - borderless buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-xs font-bold text-slate-700 hover:text-red-600 shadow-sm border-none ring-1 ring-slate-200 hover:ring-red-200 transition-all flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-red-600" />
              <span>Products</span>
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-xs font-bold text-slate-700 hover:text-red-600 shadow-sm border-none ring-1 ring-slate-200 hover:ring-red-200 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span>Orders</span>
            </Link>
            <Link
              to="/admin/inventory"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-xs font-bold text-slate-700 hover:text-red-600 shadow-sm border-none ring-1 ring-slate-200 hover:ring-red-200 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Inventory</span>
            </Link>
            <Link
              to="/admin/settings"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-xs font-bold text-slate-700 hover:text-red-600 shadow-sm border-none ring-1 ring-slate-200 hover:ring-red-200 transition-all flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-red-600" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsQROpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-[#5B21B6] shadow-sm border-none ring-1 ring-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
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
              <div key={i} className="h-28 rounded-3xl bg-white shadow-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Confirmed Revenue */}
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Confirmed Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '2,609'}
              </div>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Razorpay & Paid Orders
              </p>
            </div>

            {/* Total Orders */}
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Orders Placed</span>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</div>
              <p className="text-[11px] text-red-600 font-bold">
                {stats?.pendingOrders || 0} Awaiting Dispatch
              </p>
            </div>

            {/* Active Footwear Styles */}
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Catalog Footwear</span>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stats?.productsCount || 0}</div>
              <p className="text-[11px] text-slate-500 font-medium">Styles with 3D & Videos</p>
            </div>

            {/* Low Stock Alerts */}
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Low Stock Variants</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600">
                {stats?.lowStockVariants || 0}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Less than 5 pairs in warehouse</p>
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Recent Customer Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-3.5">Order No</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Payment</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Total</th>
                  <th className="py-3 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-red-50/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-red-600">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 font-medium">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3.5 font-medium">
                      <span className="font-bold text-slate-900">{ord.paymentMethod}</span> (
                      {ord.paymentStatus})
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border-none">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-black text-slate-900">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <Link
                        to={`/orders/${ord.orderNumber}`}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
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
