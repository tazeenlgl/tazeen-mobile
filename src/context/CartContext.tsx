import React, { createContext, useContext, useMemo, useState } from 'react';
import { products } from '../data/products';
import { usePersistedState } from '../utils/storage';
import type { Product } from '../types/product';
import type { ProductOffer } from '../types/offer';
import type { TryOnResult } from '../types/tryOn';

export type CartItem = {
  id: string; // `${product.id}__${size}`
  product: Product;
  size: string;
  quantity: number;
  // Preserves the offer the shopper selected on Product Details, if any.
  // Mock-only — not applied to pricing yet, kept for a future checkout.
  appliedOffer?: ProductOffer;
  // Preserves the mock Try-On result, if the shopper added to cart from
  // the Try-On Result screen. Mock-only — not used for pricing/fulfillment.
  tryOnResult?: TryOnResult;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (
    product: Product,
    size: string,
    appliedOffer?: ProductOffer,
    tryOnResult?: TryOnResult,
  ) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalDiscount: number;
  total: number;
};

// Light shape saved on the device; products are looked up again on load.
type StoredCartItem = {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  appliedOffer?: ProductOffer;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildItemId(productId: string, size: string): string {
  return `${productId}__${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = usePersistedState<StoredCartItem[]>('cart', []);
  // Try-on results are large and mock-only, so they live in memory only.
  const [tryOnResults, setTryOnResults] = useState<Record<string, TryOnResult>>({});

  const items = useMemo<CartItem[]>(
    () =>
      stored.flatMap(entry => {
        const product = products.find(p => p.id === entry.productId);
        return product
          ? [{ ...entry, product, tryOnResult: tryOnResults[entry.id] }]
          : [];
      }),
    [stored, tryOnResults],
  );
  const setItems = (update: (current: CartItem[]) => CartItem[]) =>
    setStored(current => {
      const full = current.flatMap(entry => {
        const product = products.find(p => p.id === entry.productId);
        return product ? [{ ...entry, product }] : [];
      });
      return update(full).map(item => ({
        id: item.id,
        productId: item.product.id,
        size: item.size,
        quantity: item.quantity,
        appliedOffer: item.appliedOffer,
      }));
    });

  const addToCart = (
    product: Product,
    size: string,
    appliedOffer?: ProductOffer,
    tryOnResult?: TryOnResult,
  ) => {
    const itemId = buildItemId(product.id, size);
    if (tryOnResult) {
      setTryOnResults(current => ({ ...current, [itemId]: tryOnResult }));
    }
    setItems(current => {
      const existing = current.find(item => item.id === itemId);
      if (existing) {
        return current.map(item =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity + 1,
                appliedOffer: appliedOffer ?? item.appliedOffer,
                tryOnResult: tryOnResult ?? item.tryOnResult,
              }
            : item,
        );
      }
      return [
        ...current,
        { id: itemId, product, size, quantity: 1, appliedOffer, tryOnResult },
      ];
    });
  };

  const incrementQuantity = (itemId: string) => {
    setItems(current =>
      current.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrementQuantity = (itemId: string) => {
    setItems(current =>
      current.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setStored([]);
    setTryOnResults({});
  };

  const { subtotal, totalDiscount, total } = useMemo(() => {
    let mrpTotal = 0;
    let sellingTotal = 0;
    items.forEach(item => {
      mrpTotal += item.product.mrp * item.quantity;
      sellingTotal += item.product.sellingPrice * item.quantity;
    });
    return {
      subtotal: mrpTotal,
      totalDiscount: mrpTotal - sellingTotal,
      total: sellingTotal,
    };
  }, [items]);

  const value: CartContextValue = {
    items,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalDiscount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
