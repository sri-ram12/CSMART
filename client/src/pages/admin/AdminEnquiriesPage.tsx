import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { WhatsAppEnquiry } from '../../types';
import {
  MessageCircle,
  Phone,
  Search,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Plus,
  RefreshCw,
  Edit2,
  X,
  ExternalLink,
  Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<WhatsAppEnquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED'>('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Manual Lead Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newBrand, setNewBrand] = useState('Walkaroo');
  const [newPrice, setNewPrice] = useState('');
  const [newSize, setNewSize] = useState('UK 8');
  const [newMessage, setNewMessage] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED'>('NEW');

  // Edit Notes Modal State
  const [editingEnquiry, setEditingEnquiry] = useState<WhatsAppEnquiry | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getEnquiries({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setEnquiries(data);
    } catch (e: any) {
      console.error(e);
      setNotification({ type: 'error', message: e.message || 'Failed to load customer inquiries.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, search]);

  const stats = useMemo(() => {
    const total = enquiries.length;
    let newCount = 0;
    let contactedCount = 0;
    let convertedCount = 0;
    for (const e of enquiries) {
      if (e.status === 'NEW') newCount++;
      else if (e.status === 'CONTACTED') contactedCount++;
      else if (e.status === 'CONVERTED') convertedCount++;
    }
    return { total, newCount, contactedCount, convertedCount };
  }, [enquiries]);

  // Handle status update
  const handleUpdateStatus = async (id: string, status: WhatsAppEnquiry['status']) => {
    try {
      const updated = await api.admin.updateEnquiryStatus(id, { status });
      setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item)));
      setNotification({ type: 'success', message: `Lead status updated to ${status}.` });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status.' });
    }
  };

  // Handle notes update
  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;
    try {
      const updated = await api.admin.updateEnquiryStatus(editingEnquiry.id, { notes: editNotes });
      setEnquiries((prev) => prev.map((item) => (item.id === editingEnquiry.id ? { ...item, notes: updated.notes } : item)));
      setEditingEnquiry(null);
      setNotification({ type: 'success', message: 'Admin notes saved successfully.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save notes.' });
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer inquiry record?')) {
      try {
        await api.admin.deleteEnquiry(id);
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        setNotification({ type: 'success', message: 'Enquiry record removed.' });
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Failed to delete record.' });
      }
    }
  };

  // Handle create manual lead
  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.admin.createEnquiry({
        customerName: newCustomerName.trim() || 'Store Customer',
        phone: newPhone.trim(),
        productTitle: newProductTitle.trim(),
        sku: newSku.trim(),
        brand: newBrand,
        price: newPrice ? parseFloat(newPrice) : undefined,
        size: newSize,
        message: newMessage || 'Walk-in or phone customer inquiry recorded by store owner.',
        notes: newNotes,
        status: newStatus,
      });

      setEnquiries((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNotification({ type: 'success', message: `Customer lead for "${created.customerName}" recorded successfully!` });

      // Reset
      setNewCustomerName('');
      setNewPhone('');
      setNewProductTitle('');
      setNewSku('');
      setNewPrice('');
      setNewNotes('');
      setNewMessage('');
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to record customer lead.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-purple-200/60 gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2.5 rounded-2xl bg-white text-slate-600 hover:text-[#5B21B6] shadow-xs border border-purple-100 transition-all cursor-pointer"
              title="Back to Admin Console"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#25D366] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <MessageCircle className="w-3 h-3 fill-white" /> WhatsApp Leads
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Customer WhatsApp Product Enquiries
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                History of customers inquiring about footwear styles, sizes, availability &amp; pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={loadEnquiries}
              className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-600 hover:text-[#5B21B6] border border-purple-200/80 shadow-xs transition cursor-pointer"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Log Customer Enquiry</span>
            </button>
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center justify-between animate-in fade-in duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <span>Total Enquiries</span>
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.total}</div>
            <p className="text-[11px] text-slate-400 font-medium">Recorded via Website &amp; WhatsApp</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <span>New (Pending)</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.newCount}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Awaiting Store Owner Reply</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <span>In Discussion</span>
              <Phone className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-600">{stats.contactedCount}</div>
            <p className="text-[11px] text-slate-400 font-medium">Size/Trial details communicated</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <span>Shop Purchases</span>
              <Sparkles className="w-4 h-4 text-[#5B21B6]" />
            </div>
            <div className="text-2xl font-black text-[#5B21B6]">{stats.convertedCount}</div>
            <p className="text-[11px] text-[#5B21B6] font-medium">Converted to Retail Sales</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Customer Name, Phone, Footwear Style, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#5B21B6] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-600 border border-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Leads' : st === 'NEW' ? 'New' : st === 'CONTACTED' ? 'Contacted' : st === 'CONVERTED' ? 'Purchased' : 'Closed'}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Customer Enquiries Table */}
        <div className="bg-white rounded-3xl shadow-xs border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7FD] text-slate-700 uppercase font-bold text-[11px] border-b border-purple-100">
                <tr>
                  <th className="py-4 px-4">Customer Lead</th>
                  <th className="py-4 px-3">Product Enquired</th>
                  <th className="py-4 px-3">Enquiry Content</th>
                  <th className="py-4 px-3 text-center">Status</th>
                  <th className="py-4 px-3">Owner Notes</th>
                  <th className="py-4 px-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No customer WhatsApp enquiries match your criteria.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => {
                    const cleanPhone = (enq.phone || '').replace(/\D/g, '');
                    const customerWaUrl = cleanPhone
                      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                          `Hello ${enq.customerName || 'Sir/Madam'}, thank you for contacting Chandhana Shoe Mart Tagarapuvalasa regarding ${enq.productTitle || 'our footwear'}. How can we assist you?`
                        )}`
                      : null;

                    return (
                      <tr key={enq.id} className="hover:bg-purple-50/20 transition-colors">
                        {/* Customer Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {enq.customerName || 'Store Visitor'}
                              </span>
                              {enq.phone ? (
                                <a
                                  href={`tel:${enq.phone}`}
                                  className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>+91 {enq.phone}</span>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400">Web click inquiry</span>
                              )}
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Product Enquired */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5 max-w-xs">
                            {enq.imageUrl ? (
                              <img
                                src={enq.imageUrl}
                                alt={enq.productTitle || 'Shoe'}
                                className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-purple-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate text-xs">
                                {enq.productTitle || 'Footwear Style'}
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
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
                                {enq.size && (
                                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                                    {enq.size}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Message Content */}
                        <td className="py-3.5 px-3 max-w-sm">
                          <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                            "{enq.message}"
                          </p>
                        </td>

                        {/* Status Toggle Dropdown */}
                        <td className="py-3.5 px-3 text-center">
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black border cursor-pointer ${
                              enq.status === 'NEW'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : enq.status === 'CONTACTED'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : enq.status === 'CONVERTED'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="NEW">🟢 New Lead</option>
                            <option value="CONTACTED">🔵 Contacted</option>
                            <option value="CONVERTED">🟣 Purchased</option>
                            <option value="CLOSED">⚪ Closed</option>
                          </select>
                        </td>

                        {/* Admin Notes */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] text-slate-500 truncate">
                              {enq.notes || <span className="text-slate-300 italic">No notes</span>}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEnquiry(enq);
                                setEditNotes(enq.notes || '');
                              }}
                              className="p-1 text-slate-400 hover:text-[#5B21B6] border-none bg-transparent cursor-pointer shrink-0"
                              title="Edit Notes"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Direct Reply */}
                            {customerWaUrl ? (
                              <a
                                href={customerWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition"
                                title="Reply directly on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                <span>WhatsApp</span>
                              </a>
                            ) : null}

                            {/* Call Phone */}
                            {enq.phone && (
                              <a
                                href={`tel:${enq.phone}`}
                                className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B21B6] border border-purple-200 transition"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(enq.id)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

      {/* MODAL 1: LOG MANUAL CUSTOMER LEAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Record Customer WhatsApp Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Naidu"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9848012345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Footwear / Product Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Walkaroo Daily Slide Sandals"
                    value={newProductTitle}
                    onChange={(e) => setNewProductTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 871"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  >
                    {['Walkaroo', 'Sparx', 'VKC Pride', 'Paragon', 'Walkmate', 'Striker', 'Brano', 'Redfort', 'Zaguaar', 'Hison', 'Poster Shoes', 'Lancer', 'Jockey', 'Sushma', 'TR Selections', 'ZM Selections', 'Airpistha', 'Doctor Choice'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 499"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g. UK 8"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Enquiry Details / Message</label>
                <textarea
                  rows={2}
                  placeholder="What did the customer ask for?"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Visiting shop today at 6pm for trial"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold shadow-md border-none cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ADMIN NOTES */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Notes for {editingEnquiry.customerName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEnquiry(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Follow-up Notes / Customer Requirements
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Customer requested size 9 in brown, confirmed visit on Friday."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-md border-none cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;

