import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { testOrders } from '../data/orders';
import { ORDER_STEPS } from '../types/order';
import type { Order, OrderStatus, ReturnRequest } from '../types/order';
import { usePersistedState } from '../utils/storage';

type OrderContextValue = {
  orders: Order[];
  // Newest first.
  addOrder: (order: Order) => void;
  // Moves an order to the next tracking step (mock courier updates).
  advanceOrder: (id: string) => OrderStatus | null;
  cancelOrder: (id: string) => void;
  requestReturn: (id: string, request: ReturnRequest) => void;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = usePersistedState<Order[]>('orders', testOrders);

  const addOrder = useCallback(
    (order: Order) => setOrders(current => [order, ...current]),
    [setOrders],
  );

  const patch = useCallback(
    (id: string, change: (order: Order) => Order) =>
      setOrders(current => current.map(order => (order.id === id ? change(order) : order))),
    [setOrders],
  );

  const advanceOrder = useCallback(
    (id: string): OrderStatus | null => {
      const order = orders.find(item => item.id === id);
      if (!order || order.status === 'Cancelled') {
        return null;
      }
      const next = ORDER_STEPS[ORDER_STEPS.indexOf(order.status) + 1];
      if (!next) {
        return null;
      }
      patch(id, current => ({
        ...current,
        status: next,
        history: { ...current.history, [next]: new Date().toISOString() },
      }));
      return next;
    },
    [orders, patch],
  );

  const cancelOrder = useCallback(
    (id: string) => patch(id, current => ({ ...current, status: 'Cancelled' })),
    [patch],
  );

  const requestReturn = useCallback(
    (id: string, request: ReturnRequest) =>
      patch(id, current => ({ ...current, returnRequest: request })),
    [patch],
  );

  const value = useMemo(
    () => ({ orders, addOrder, advanceOrder, cancelOrder, requestReturn }),
    [orders, addOrder, advanceOrder, cancelOrder, requestReturn],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders(): OrderContextValue {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
