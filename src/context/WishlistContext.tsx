import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistedState } from '../utils/storage';

type WishlistContextValue = {
  ids: string[];
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = usePersistedState<string[]>('wishlist', []);

  const isSaved = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback(
    (productId: string) =>
      setIds(current =>
        current.includes(productId)
          ? current.filter(id => id !== productId)
          : [productId, ...current],
      ),
    [setIds],
  );

  const value = useMemo(() => ({ ids, isSaved, toggle }), [ids, isSaved, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
