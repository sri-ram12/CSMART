import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newTracking, setNewTracking] = useState('');
  const [newCourier, setNewCourier] = useState('Delhivery Express');

  const loadOrders = async () => {
    try {
      const data = await api.admin.getOrders({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search || undefined,
      });
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleOpenStatusModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setNewTracking(ord.trackingNumber || `CSM-AWB-${Math.floor(100000 + Math.random() * 900000)}`);
    setNewCourier(ord.courierName || 'Delhivery Express');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.admin.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        trackingNumber: newTracking,
        courierName: newCourier,
      });
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-red-600 shadow-sm ring-1 ring-slate-200 border-none transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Order Fulfillment & Tracking</h1>
              <p className="text-xs text-slate-500 font-medium">Total {orders.length} customer orders recorded</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer Name, or Tracking AWB..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm font-medium"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white text-xs text-slate-700 px-3.5 py-2.5 rounded-xl border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURN_REQUESTED">Return Requested</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Order Number</th>
                <th className="py-3 px-3.5">Customer</th>
                <th className="py-3 px-3.5">Items</th>
                <th className="py-3 px-3.5">Total Amount</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Courier & Tracking</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-red-600">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{ord.guestName || ord.user?.name || 'Customer'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{ord.guestPhone || ord.user?.phone || 'No phone'}</span>
                  </td>
                  <td className="py-3 px-3.5 font-medium">
                    {ord.items?.length || 0} pair(s)
                  </td>
                  <td className="py-3 px-3.5 font-black text-slate-900">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border-none">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600">
                    {ord.trackingNumber ? (
                      <>
                        <span className="text-slate-900 font-bold block">{ord.trackingNumber}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{ord.courierName}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(ord)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border-none transition-colors cursor-pointer"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Status Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border-none">
              <h3 className="text-base font-extrabold text-slate-900">
                Update Order: <span className="font-mono text-red-600">{selectedOrder.orderNumber}</span>
              </h3>

              <form onSubmit={handleUpdateStatus} className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Workflow Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RETURN_REQUESTED">Return Requested</option>
                    <option value="RETURNED">Returned</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Courier Partner</label>
                  <input
                    type="text"
                    value={newCourier}
                    onChange={(e) => setNewCourier(e.target.value)}
                    placeholder="Delhivery Express / Blue Dart"
                    className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Tracking AWB Number</label>
                  <input
                    type="text"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-2.5 px-6 font-bold text-xs border-none shadow-md cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
