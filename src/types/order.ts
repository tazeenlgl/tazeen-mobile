export type OrderStatus =
  | 'Placed'
  | 'Packed'
  | 'Shipped'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled';

export type OrderItem = {
  productId: string;
  title: string;
  size: string;
  quantity: number;
  unitPrice: number;
  // Tint used for the thumbnail until real product photos exist.
  imageTint: string;
};

export type ReturnKind = 'Return' | 'Exchange';

export type ReturnRequest = {
  kind: ReturnKind;
  reason: string;
  note: string;
  // `${productId}-${size}` keys of the items sent back.
  itemKeys: string[];
  requestedAt: string; // ISO date
};

export type Order = {
  id: string;
  placedAt: string; // ISO date
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  addressLabel: string;
  addressSummary: string;
  // ISO date when each step was reached, keyed by status.
  history?: Partial<Record<OrderStatus, string>>;
  returnRequest?: ReturnRequest;
  // Payment gateway transaction id, when paid online.
  paymentRef?: string;
};

// Timeline order for non-cancelled orders.
export const ORDER_STEPS: Exclude<OrderStatus, 'Cancelled'>[] = [
  'Placed',
  'Packed',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

export const orderItemKey = (item: OrderItem): string => `${item.productId}-${item.size}`;
