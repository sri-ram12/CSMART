import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Order } from '../types';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#DC2626', '#EF4444', '#F87171', '#FFFFFF'],
    });

    if (orderNumber) {
      api.orders
        .getByIdOrNumber(orderNumber)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

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
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Card Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white shadow-xl border-none text-center space-y-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 border-none">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank You for Shopping with Chandhana Shoe Mart!
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your footwear order has been logged into our fulfillment hub. A confirmation SMS & email have been dispatched.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="px-3.5 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
              Order No: <strong className="text-red-600 font-mono font-black">{orderNumber}</strong>
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Est. Delivery: {order?.estimatedDelivery || 'In 3-4 Business Days'}</span>
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/orders/${orderNumber}`}
              className="btn-primary text-xs font-bold py-3 px-7 flex items-center gap-2 border-none shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </Link>
            <button
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-all border-none flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
          </div>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary & Shipping Destination
            </h3>

            {/* Address */}
            <div className="p-4 rounded-2xl bg-slate-50 border-none text-xs space-y-1">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm mb-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Delivery Address</span>
              </div>
              <p className="text-slate-900 font-bold">{addressData.fullName}</p>
              <p className="text-slate-600">{addressData.street}</p>
              <p className="text-slate-600">
                {addressData.city}, {addressData.state} - {addressData.postalCode}
              </p>
              <p className="text-slate-500 font-medium pt-1">Phone: {addressData.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Footwear Items ({order.items.length})
              </h4>
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || ''}
                        alt={item.productTitle}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-50 border-none"
                      />
                      <div>
                        <h5 className="font-bold text-slate-900">{item.productTitle}</h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Size: {item.size} • Color: {item.colorName} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${order.shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total Amount Paid ({order.paymentMethod})</span>
                <span className="text-red-600 font-black">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/shop" className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1.5 transition-colors">
            <span>Continue Shopping at Chandhana Shoe Mart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
