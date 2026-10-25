import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Check, Tag, MessageCircle, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getWhatsAppCartOrderUrl } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    couponDiscount,
    couponMessage,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    shippingFee,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

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
              className="border-none p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
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
                  className="mt-5 btn-primary text-xs py-3 px-6 border-none shadow-md cursor-pointer"
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
                          className="border-none px-2.5 py-1 text-xs text-slate-500 hover:text-red-600 font-bold bg-transparent cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="border-none px-2.5 py-1 text-xs text-slate-500 hover:text-red-600 font-bold bg-transparent cursor-pointer"
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
                    className="border-none text-slate-400 hover:text-rose-600 p-1.5 self-start transition-colors bg-transparent cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Totals & Dynamic Coupon */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              {/* Active Coupon Tag if applied */}
              {appliedCoupon && couponDiscount > 0 ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon {appliedCoupon} applied (-₹{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-red-600 hover:underline border-none bg-transparent cursor-pointer font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                /* Coupon Input Form */
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-red-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. WELCOME10, FESTIVE20)"
                      className="w-full pl-8 pr-2 py-2 bg-slate-50 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 border-none font-medium uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="btn-secondary text-xs py-2 px-4 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponMessage && (
                <div
                  className={`text-[11px] font-semibold ${
                    couponDiscount > 0 ? 'text-emerald-600' : 'text-red-600'
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
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* WhatsApp Direct Order CTA */}
              <a
                href={getWhatsAppCartOrderUrl(
                  items.map((it) => ({
                    title: it.title,
                    size: it.size,
                    colorName: it.colorName,
                    quantity: it.quantity,
                    unitPrice: it.unitPrice,
                  })),
                  total
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => closeCart()}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 sm:py-4 text-xs sm:text-sm font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 transition-all border-none"
                title="Order on WhatsApp with Owner"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-none" />
                <span>Order on WhatsApp with Owner</span>
              </a>

              <a
                href="tel:9553536884"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-50 text-[#5B21B6] hover:bg-purple-100 transition-all text-xs font-bold border-none"
              >
                <Phone className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span>Call Owner: 9553536884</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
