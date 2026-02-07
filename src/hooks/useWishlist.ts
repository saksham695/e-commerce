import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for managing user's wishlist
 */
export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`wishlist_${user.id}`);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    }
  }, [user]);

  const addToWishlist = useCallback((productId: string) => {
    if (!user) return;
    
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      const newWishlist = [...prev, productId];
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, [user]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (!user) return;
    
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, [user]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length,
  };
}
