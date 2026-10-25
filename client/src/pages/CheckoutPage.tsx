import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, appliedCoupon, couponDiscount, shippingFee, clearCart, stockIssues } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address form fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Tagarapuvalasa');
  const [state, setState] = useState('Andhra Pradesh');
  const [postalCode, setPostalCode] = useState('531162');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prefill if customer has saved addresses
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFullName(def.fullName || user.name);
      setPhone(def.phone || user.phone || '');
      setStreet(def.street || '');
      setCity(def.city || 'Tagarapuvalasa');
      setState(def.state || 'Andhra Pradesh');
      setPostalCode(def.postalCode || '531162');
    }
  }, [user]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const discountAmount = couponDiscount;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      setErrorMessage('Please complete all required shipping address fields.');
      return;
    }

    if (!/^\d{6}$/.test(postalCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress = {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country: 'India',
    };

    const guestInfo = !user ? { name: fullName, email, phone } : undefined;

    try {
      if (paymentMethod === 'COD') {
        const order = await api.orders.create({
          items,
          shippingAddress,
          paymentMethod: 'COD',
          couponCode: appliedCoupon || undefined,
          guestInfo,
        });

        clearCart();
        navigate(`/order-confirmed/${order.orderNumber}`);
      } else {
        const rzpData = await api.payment.createRazorpayOrder(totalAmount);

        if (typeof window !== 'undefined' && window.Razorpay) {
          const options = {
            key: rzpData.keyId,
            amount: rzpData.amount,
            currency: rzpData.currency,
            name: 'Chandhana Shoe Mart',
            description: `Payment for Footwear Order`,
            order_id: rzpData.orderId,
            prefill: {
              name: fullName,
              email: email || 'customer@chandhanashoemart.com',
              contact: phone,
            },
            theme: {
              color: '#DC2626',
            },
            handler: async (response: any) => {
              try {
                const verifyRes = await api.payment.verifyRazorpay({
                  razorpay_order_id: response.razorpay_order_id || rzpData.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'mock_signature',
                });

                if (verifyRes.verified) {
                  const order = await api.orders.create({
                    items,
                    shippingAddress,
                    paymentMethod: 'RAZORPAY',
                    paymentId: verifyRes.paymentId,
                    razorpayOrderId: rzpData.orderId,
                    razorpayPaymentId: response.razorpay_payment_id,
                    couponCode: appliedCoupon || undefined,
                    guestInfo,
                  });

                  clearCart();
                  navigate(`/order-confirmed/${order.orderNumber}`);
                }
              } catch (err: any) {
                setErrorMessage(err.message || 'Payment verification failed.');
              }
            },
            modal: {
              ondismiss: () => {
                setIsSubmitting(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          const mockPaymentId = `pay_sandbox_${Date.now()}`;
          const order = await api.orders.create({
            items,
            shippingAddress,
            paymentMethod: 'RAZORPAY',
            paymentId: mockPaymentId,
            razorpayOrderId: rzpData.orderId,
            couponCode: appliedCoupon || undefined,
            guestInfo,
          });

          clearCart();
          navigate(`/order-confirmed/${order.orderNumber}`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Checkout & Order Placement</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Complete your delivery destination and select preferred payment
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 text-xs text-red-600 font-semibold flex items-center gap-2 border-none">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">1. Shipping & Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98450 12345"
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address (for order receipts)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Street Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat/House No, Building, Street, Area"
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 560001"
                    className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-slate-100 px-3.5 py-2.5 rounded-xl text-xs text-slate-500 border-none cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">2. Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-4 rounded-2xl border-none cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'RAZORPAY'
                      ? 'bg-red-50/70 ring-2 ring-red-600 shadow-sm'
                      : 'bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Online Payment (UPI, Cards, Netbanking)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Official Razorpay gateway with instant verification.
                    </p>
                    <span className="inline-block mt-2 text-[10px] bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold border-none shadow-xs">
                      Recommended
                    </span>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border-none cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'COD'
                      ? 'bg-red-50/70 ring-2 ring-red-600 shadow-sm'
                      : 'bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Pay cash or UPI directly to delivery courier partner at your doorstep.
                    </p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold border-none shadow-xs">
                      Zero Advance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({items.length} styles)
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3.5 pr-1">
                {items.map((item) => (
                  <div key={item.sku} className="flex gap-3 text-xs items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-50 shrink-0 border-none"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.size} • {item.colorName} • Qty {item.quantity}
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Final Amount</span>
                  <span className="text-red-600 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA - borderless button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50 border-none shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>Doorstep Inspection & Easy 7-Day Exchange Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
