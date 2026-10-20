import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('csm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      api.auth
        .getWishlist()
        .then((items) => {
          setWishlist(items);
          localStorage.setItem('csm_wishlist', JSON.stringify(items));
        })
        .catch(() => {});
    }
  }, [user]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product.id);
    let updated: Product[];

    if (exists) {
      updated = wishlist.filter((p) => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);
    localStorage.setItem('csm_wishlist', JSON.stringify(updated));

    if (user) {
      try {
        await api.auth.toggleWishlist(product.id);
      } catch (err) {
        console.error('Failed to sync wishlist on server', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
