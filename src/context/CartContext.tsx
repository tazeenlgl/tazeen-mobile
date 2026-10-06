import React, { createContext, useContext, useMemo, useState } from 'react';
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
  subtotal: number;
  totalDiscount: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function buildItemId(productId: string, size: string): string {
  return `${productId}__${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    size: string,
    appliedOffer?: ProductOffer,
    tryOnResult?: TryOnResult,
  ) => {
    const itemId = buildItemId(product.id, size);
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
