import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Address, Order } from '../types';
import {
  User,
  Package,
  MapPin,
  Plus,
  Trash2,
  Truck,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile fields
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // New Address modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.name || '');
  const [newPhone, setNewPhone] = useState(user?.phone || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState, setNewState] = useState('Karnataka');
  const [newPostalCode, setNewPostalCode] = useState('560001');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    Promise.all([api.orders.getMyOrders(), api.auth.getAddresses()])
      .then(([ordersData, addrData]) => {
        setOrders(ordersData);
        setAddresses(addrData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name: editName, phone: editPhone });
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile.');
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await api.auth.addAddress({
        fullName: newFullName,
        phone: newPhone,
        street: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [added, ...prev]);
      setIsAddAddressOpen(false);
      setNewStreet('');
    } catch (err: any) {
      alert(err.message || 'Failed to add address.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.auth.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete address.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-sm border-none flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                {user.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border-none">
                    <ShieldAlert className="w-3 h-3" /> Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</p>
              {user.phone && <p className="text-xs text-slate-500 font-medium">{user.phone}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-1.5 border-none shadow-md"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors flex items-center gap-1.5 border-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - borderless buttons */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-none relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-none relative cursor-pointer ${
              activeTab === 'addresses'
                ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-none relative cursor-pointer ${
              activeTab === 'profile'
                ? 'text-red-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Profile</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-white shadow-sm animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl shadow-sm border-none space-y-3">
                <Package className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-900">No footwear orders yet</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Explore our high-performance runners and cloud comfort slippers.
                </p>
                <Link to="/shop" className="btn-primary text-xs py-2.5 px-6 inline-block mt-2 border-none shadow-md">
                  Browse Collection
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white shadow-sm border-none space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-red-600">
                        {o.orderNumber}
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Placed on {new Date(o.createdAt).toLocaleDateString()} • {o.items.length}{' '}
                        Items
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border-none ${
                          o.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : o.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {o.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2.5">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {it.imageUrl && (
                            <img
                              src={it.imageUrl}
                              alt={it.productTitle}
                              className="w-10 h-10 object-cover rounded-xl bg-slate-50 border-none"
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-900">{it.productTitle}</span>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {it.size} • {it.colorName} • Qty {it.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          ₹{it.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Payment: <strong className="text-slate-900">{o.paymentMethod}</strong> (
                      {o.paymentStatus})
                    </span>
                    <Link
                      to={`/orders/${o.orderNumber}`}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-900">Delivery Address Book</h3>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-1.5 border-none shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white shadow-sm border-none space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      {a.fullName}
                    </span>
                    {a.isDefault && (
                      <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold border-none">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{a.street}</p>
                  <p className="text-xs text-slate-600">
                    {a.city}, {a.state} - {a.postalCode}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Phone: {a.phone}</p>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(a.id)}
                      className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 border-none bg-transparent cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {isAddAddressOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border-none">
                  <h3 className="text-base font-extrabold text-slate-900">Add Delivery Destination</h3>
                  <form onSubmit={handleCreateAddress} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street Address, Building, Area"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN code"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600"
                    />

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-6 border-none shadow-md cursor-pointer">
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-md p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            {profileMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-xs text-emerald-700 font-bold border-none">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-100 px-3.5 py-2.5 rounded-xl text-xs text-slate-500 border-none cursor-not-allowed font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button type="submit" className="btn-primary text-xs font-bold py-3 px-7 border-none shadow-md cursor-pointer">
                Update Profile
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
