import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    couponDiscount,
    couponMessage,
    applyCoupon,
    removeCoupon,
    shippingFee,
    clearCart,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);
    if (res.success) {
      setCouponInput('');
    }
  };

  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50/60">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm">
          Explore our signature nitrogen runners, handcrafted leather shoes, and cloud-soft recovery slides.
        </p>
        <Link to="/shop" className="btn-primary text-xs py-3 px-8 font-bold border-none shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {items.reduce((s, i) => s + i.quantity, 0)} Items in your bag
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Line Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.sku}
                className="p-5 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-none"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-50 shrink-0 border-none"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border-none font-bold">
                        {item.size}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-inner"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-red-600 mt-2">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Controls - borderless buttons */}
                  <div className="flex items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-500 hover:text-red-600 text-xs font-bold border-none bg-transparent cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-black text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-500 hover:text-red-600 text-xs font-bold border-none bg-transparent cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm font-black text-slate-900 min-w-[80px] text-right">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.sku)}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary & Checkout Sidepanel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-white shadow-sm border-none space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Active Coupon or Input form */}
              {appliedCoupon && couponDiscount > 0 ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border-none">
                  <span>Coupon {appliedCoupon} applied (-₹{couponDiscount.toLocaleString('en-IN')})</span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline border-none bg-transparent cursor-pointer font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. WELCOME10, FESTIVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl border-none shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponMessage && (
                <div
                  className={`text-xs font-semibold ${
                    couponDiscount > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {couponMessage}
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Payable Total</span>
                  <span className="text-red-600 font-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3.5 text-xs font-black flex items-center justify-center gap-2 border-none shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>SSL Encrypted Checkout & 100% Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
