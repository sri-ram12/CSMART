import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Check, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    setAppliedCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setCouponMessage('WELCOME10 applied: 10% discount on order!');
    } else if (code === 'STEPINSTYLE') {
      if (subtotal >= 2499) {
        setAppliedCoupon('STEPINSTYLE');
        setCouponMessage('STEPINSTYLE applied: ₹500 flat off!');
      } else {
        setCouponMessage('STEPINSTYLE requires minimum order of ₹2,499');
      }
    } else {
      setCouponMessage('Invalid coupon code');
    }
  };

  const calculateDiscount = () => {
    if (appliedCoupon === 'WELCOME10') return subtotal * 0.1;
    if (appliedCoupon === 'STEPINSTYLE' && subtotal >= 2499) return 500;
    return 0;
  };

  const discount = calculateDiscount();
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Your Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="border-none p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (White & Red) */}
          <div className="bg-red-50/50 px-4 py-3 border-b border-red-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
              <Truck className="w-4 h-4 text-red-600 shrink-0" />
              {amountNeeded > 0 ? (
                <span>
                  Add <span className="text-red-600 font-bold">₹{amountNeeded}</span> more for{' '}
                  <span className="font-extrabold text-slate-900">FREE Express Delivery</span>
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Unlocked FREE Express Delivery!
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-rose-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover our engineered running shoes, heritage sneakers, or cloud slippers to get started.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="mt-5 btn-primary text-xs py-3 px-6"
                >
                  Explore Footwear
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.sku}
                  className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border-none relative group"
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl bg-white shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="bg-white px-2 py-0.5 rounded-md font-semibold text-slate-700 shadow-xs">
                        {item.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.colorName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* BORDERLESS Quantity adjustment */}
                      <div className="flex items-center rounded-xl bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="border-none px-2.5 py-1 text-xs text-slate-500 hover:text-red-600 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="border-none px-2.5 py-1 text-xs text-slate-500 hover:text-red-600 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-black text-slate-900">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.sku)}
                    className="border-none text-slate-400 hover:text-rose-600 p-1.5 self-start transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Totals & Coupon */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-red-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. WELCOME10)"
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 border-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary text-xs py-2 px-4 shrink-0"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <div
                  className={`text-[11px] font-semibold ${
                    couponMessage.includes('applied') ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {couponMessage}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
                className="w-full border-none text-center text-xs font-bold text-slate-500 hover:text-red-600 transition-colors py-1"
              >
                View Full Shopping Cart Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
