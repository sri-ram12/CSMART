import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Order } from '../types';
import {
  CheckCircle2,
  MapPin,
  Search,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OrderTrackingPage: React.FC = () => {
  const { idOrNumber } = useParams<{ idOrNumber?: string }>();
  const [searchInput, setSearchInput] = useState(idOrNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cancellation & Return modals
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of mind / Found another pair');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size is too small/large');

  const { user } = useAuth();

  const fetchOrder = async (numberToSearch: string) => {
    if (!numberToSearch.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.orders.getByIdOrNumber(numberToSearch.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idOrNumber) {
      fetchOrder(idOrNumber);
    }
  }, [idOrNumber, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const updated = await api.orders.cancel(order.id, cancelReason);
      setOrder(updated);
      setCancelModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const handleReturnOrder = async () => {
    if (!order) return;
    try {
      const updated = await api.orders.returnRequest(order.id, returnReason);
      setOrder(updated);
      setReturnModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit return request.');
    }
  };

  const stages = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received in hub' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Payment verified' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Quality inspection' },
    { key: 'PACKED', label: 'Packed', desc: 'Sealed with care' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'In courier transit' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Driver on route' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered to recipient' },
  ];

  const getStageIndex = (status: string) => {
    return stages.findIndex((s) => s.key === status);
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;
  const isCancelled = order?.status === 'CANCELLED';
  const isReturnRequested = order?.status === 'RETURN_REQUESTED';

  let addressData: any = {};
  if (order?.shippingAddress) {
    try {
      addressData =
        typeof order.shippingAddress === 'string'
          ? JSON.parse(order.shippingAddress)
          : order.shippingAddress;
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Live Footwear Shipment Tracking</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time status updates from Chandhana Shoe Mart central fulfillment center
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order No (e.g. CSM-2026-9842)"
              className="w-full pl-10 pr-3.5 py-3 bg-white rounded-2xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono uppercase shadow-sm"
            />
          </div>
          <button type="submit" className="btn-primary text-xs font-bold py-3 px-6 border-none shadow-md cursor-pointer">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-xs text-red-600 font-semibold flex items-center gap-2 border-none">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Tracking Timeline Card */}
        {order && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-sm border-none space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 mb-1.5 border-none">
                  Official Tracking Record
                </span>
                <h3 className="text-xl font-black text-slate-900 font-mono">{order.orderNumber}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 font-medium">Estimated Delivery:</span>
                <div className="text-sm font-extrabold text-red-600">
                  {order.estimatedDelivery || 'In 2-3 Business Days'}
                </div>
                {order.trackingNumber && (
                  <div className="text-[11px] text-slate-600 font-mono mt-0.5 font-medium">
                    AWB: {order.trackingNumber} ({order.courierName})
                  </div>
                )}
              </div>
            </div>

            {/* Special status banners */}
            {isCancelled && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs flex items-center gap-3 border-none">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold">Order Cancelled: </span>
                  <span>{order.cancelReason || 'Customer requested cancellation'}. Inventory restored.</span>
                </div>
              </div>
            )}

            {isReturnRequested && (
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 text-xs flex items-center gap-3 border-none">
                <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Return Pickup Scheduled: </span>
                  <span>Reason: {order.returnReason}. Our courier partner will inspect and collect the footwear package.</span>
                </div>
              </div>
            )}

            {/* Visual Timeline Stages */}
            {!isCancelled && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Dispatch Journey
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {stages.map((stage, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3.5 rounded-2xl text-center transition-all border-none ${
                          isCurrent
                            ? 'bg-red-50 ring-2 ring-red-600 shadow-sm'
                            : isPassed
                            ? 'bg-slate-50 ring-1 ring-slate-200'
                            : 'bg-slate-50/50 opacity-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold border-none ${
                            isCurrent
                              ? 'bg-red-600 text-white shadow-sm'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <h5
                          className={`text-xs font-bold truncate ${
                            isCurrent ? 'text-red-600' : isPassed ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Destination & Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="text-xs space-y-1 text-slate-600">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> Delivered To:
                </span>
                <p className="font-bold text-slate-900 text-sm">{addressData.fullName}</p>
                <p>{addressData.street}, {addressData.city}, {addressData.state} - {addressData.postalCode}</p>
                <p className="text-slate-500 font-medium pt-1">Contact: {addressData.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 self-center">
                {['PLACED', 'CONFIRMED', 'PROCESSING'].includes(order.status) && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors border-none cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-red-600 transition-colors flex items-center gap-1.5 border-none cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Request Return / Exchange</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border-none">
              <h3 className="text-base font-extrabold text-slate-900">Cancel Footwear Order</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you wish to cancel this order? Stock will be immediately restored for other walkers.
              </p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              >
                <option value="Change of mind">Change of mind</option>
                <option value="Ordered wrong size">Ordered wrong size</option>
                <option value="Found better pricing">Found better pricing</option>
                <option value="Delivery time too long">Delivery time too long</option>
              </select>
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 border-none shadow-md cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Modal */}
        {returnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border-none">
              <h3 className="text-base font-extrabold text-slate-900">7-Day Return / Exchange</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please provide the reason for exchange. Our courier partner will arrive with the replacement pair.
              </p>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
              >
                <option value="Size is too small">Size is too small</option>
                <option value="Size is too large">Size is too large</option>
                <option value="Cushioning preference">Cushioning preference</option>
                <option value="Color swap requested">Color swap requested</option>
              </select>
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnOrder}
                  className="btn-primary text-xs font-bold py-2.5 px-6 border-none shadow-md cursor-pointer"
                >
                  Schedule Pickup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
