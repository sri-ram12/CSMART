import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  couponDiscount: number;
  couponMessage: string | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discountAmount: number }>;
  removeCoupon: () => void;
  freeShippingThreshold: number;
  shippingFee: number;
  stockIssues: string[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('csm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem('csm_coupon') || null;
    } catch {
      return null;
    }
  });
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [stockIssues, setStockIssues] = useState<string[]>([]);

  const freeShippingThreshold = 999;
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;

  useEffect(() => {
    try {
      localStorage.setItem('csm_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Revalidate coupon whenever items change
  useEffect(() => {
    if (!appliedCoupon || items.length === 0) {
      setCouponDiscount(0);
      setCouponMessage(null);
      return;
    }

    api.checkout
      .validateCart({ items, couponCode: appliedCoupon })
      .then((res) => {
        if (res.coupon?.valid) {
          setCouponDiscount(res.coupon.discountAmount || 0);
          setCouponMessage(res.coupon.message || `Coupon ${appliedCoupon} applied`);
        } else {
          setCouponDiscount(0);
          setCouponMessage(res.coupon?.message || 'Coupon requirements no longer met.');
        }
        if (res.stockIssues) {
          setStockIssues(res.stockIssues);
        }
      })
      .catch(() => {
        // Fallback calculation for demo/offline
        calculateFallbackDiscount(appliedCoupon, subtotal);
      });
  }, [items, appliedCoupon, subtotal]);

  const calculateFallbackDiscount = (code: string, currentSubtotal: number) => {
    const c = code.trim().toUpperCase();
    if (c === 'WELCOME10') {
      const disc = Math.round(currentSubtotal * 0.1);
      setCouponDiscount(disc);
      setCouponMessage(`WELCOME10 applied (10% discount): -₹${disc}`);
    } else if (c === 'STEPINSTYLE') {
      if (currentSubtotal >= 2499) {
        setCouponDiscount(500);
        setCouponMessage('STEPINSTYLE applied: -₹500 flat off!');
      } else {
        setCouponDiscount(0);
        setCouponMessage('Minimum order value of ₹2,499 required for STEPINSTYLE.');
      }
    } else if (c === 'CHANDHANA50') {
      if (currentSubtotal >= 1499) {
        setCouponDiscount(200);
        setCouponMessage('CHANDHANA50 applied: -₹200 flat off!');
      } else {
        setCouponDiscount(0);
        setCouponMessage('Minimum order value of ₹1,499 required for CHANDHANA50.');
      }
    } else if (c === 'FESTIVE20') {
      if (currentSubtotal >= 1999) {
        const disc = Math.min(1000, Math.round(currentSubtotal * 0.2));
        setCouponDiscount(disc);
        setCouponMessage(`FESTIVE20 applied (20% discount up to ₹1,000): -₹${disc}`);
      } else {
        setCouponDiscount(0);
        setCouponMessage('Minimum order value of ₹1,999 required for FESTIVE20.');
      }
    } else {
      setCouponDiscount(0);
      setCouponMessage('Invalid coupon code.');
    }
  };

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      removeCoupon();
      return { success: false, message: 'Please enter a coupon code.', discountAmount: 0 };
    }

    try {
      const res = await api.checkout.validateCart({
        items,
        couponCode: trimmed,
      });

      if (res.coupon?.valid) {
        setAppliedCoupon(trimmed);
        setCouponDiscount(res.coupon.discountAmount);
        setCouponMessage(res.coupon.message);
        localStorage.setItem('csm_coupon', trimmed);
        return {
          success: true,
          message: res.coupon.message,
          discountAmount: res.coupon.discountAmount,
        };
      } else {
        const msg = res.coupon?.message || 'Invalid or expired coupon code.';
        setCouponMessage(msg);
        return { success: false, message: msg, discountAmount: 0 };
      }
    } catch {
      // Fallback local check
      const c = trimmed;
      if (c === 'WELCOME10') {
        const disc = Math.round(subtotal * 0.1);
        setAppliedCoupon('WELCOME10');
        setCouponDiscount(disc);
        setCouponMessage(`Coupon WELCOME10 applied (10% off): -₹${disc}`);
        localStorage.setItem('csm_coupon', 'WELCOME10');
        return { success: true, message: 'Coupon WELCOME10 applied (10% off)!', discountAmount: disc };
      } else if (c === 'STEPINSTYLE') {
        if (subtotal >= 2499) {
          setAppliedCoupon('STEPINSTYLE');
          setCouponDiscount(500);
          setCouponMessage('Coupon STEPINSTYLE applied: -₹500 flat off!');
          localStorage.setItem('csm_coupon', 'STEPINSTYLE');
          return { success: true, message: 'Coupon STEPINSTYLE applied (₹500 flat off)!', discountAmount: 500 };
        } else {
          const msg = 'Minimum order value of ₹2,499 required for STEPINSTYLE.';
          setCouponMessage(msg);
          return { success: false, message: msg, discountAmount: 0 };
        }
      } else if (c === 'CHANDHANA50') {
        if (subtotal >= 1499) {
          setAppliedCoupon('CHANDHANA50');
          setCouponDiscount(200);
          setCouponMessage('Coupon CHANDHANA50 applied: -₹200 flat off!');
          localStorage.setItem('csm_coupon', 'CHANDHANA50');
          return { success: true, message: 'Coupon CHANDHANA50 applied (₹200 flat off)!', discountAmount: 200 };
        } else {
          const msg = 'Minimum order value of ₹1,499 required for CHANDHANA50.';
          setCouponMessage(msg);
          return { success: false, message: msg, discountAmount: 0 };
        }
      } else if (c === 'FESTIVE20') {
        if (subtotal >= 1999) {
          const disc = Math.min(1000, Math.round(subtotal * 0.2));
          setAppliedCoupon('FESTIVE20');
          setCouponDiscount(disc);
          setCouponMessage(`Coupon FESTIVE20 applied: -₹${disc}`);
          localStorage.setItem('csm_coupon', 'FESTIVE20');
          return { success: true, message: 'Coupon FESTIVE20 applied (20% off)!', discountAmount: disc };
        } else {
          const msg = 'Minimum order value of ₹1,999 required for FESTIVE20.';
          setCouponMessage(msg);
          return { success: false, message: msg, discountAmount: 0 };
        }
      }

      const msg = 'Invalid coupon code.';
      setCouponMessage(msg);
      return { success: false, message: msg, discountAmount: 0 };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponMessage(null);
    try {
      localStorage.removeItem('csm_coupon');
    } catch {}
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity || 1;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.sku === newItem.sku);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newTotalQty = updated[existingIndex].quantity + qty;
        const maxStock = updated[existingIndex].availableStock || 99;
        updated[existingIndex].quantity = Math.min(newTotalQty, maxStock);
        return updated;
      } else {
        return [...prev, { ...newItem, quantity: qty }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.sku === sku) {
          const maxStock = i.availableStock || 99;
          return { ...i, quantity: Math.min(quantity, maxStock) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
    localStorage.removeItem('csm_cart');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        itemCount,
        subtotal,
        appliedCoupon,
        setAppliedCoupon,
        couponDiscount,
        couponMessage,
        applyCoupon,
        removeCoupon,
        freeShippingThreshold,
        shippingFee,
        stockIssues,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
