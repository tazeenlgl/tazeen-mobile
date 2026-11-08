// Shared checkout rules. Mock values until the business confirms them.
export const FREE_DELIVERY_ABOVE = 999;
export const DELIVERY_FEE = 49;
export const RETURN_WINDOW_DAYS = 7;

export const formatRupees = (value: number): string => `₹${value.toLocaleString('en-IN')}`;

// Free delivery on orders (after discount) at or above the threshold.
export const deliveryFeeFor = (payable: number): number =>
  payable === 0 || payable >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const suffix = hours >= 12 ? 'pm' : 'am';
  return `${formatDate(iso)}, ${hours % 12 || 12}:${minutes} ${suffix}`;
};

// "Tue, 12 Nov" style label for an estimated delivery date.
export const estimatedDelivery = (placedAtIso: string, days = 5): string => {
  const date = new Date(placedAtIso);
  date.setDate(date.getDate() + days);
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

export const newOrderId = (): string => `TZN-${Math.floor(100000 + Math.random() * 900000)}`;
