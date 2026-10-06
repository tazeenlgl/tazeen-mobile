export interface GiftCard {
  id: string;
  holderName: string;
  cardNumber: string; // full number, e.g. "5241 8830 1147 4821"
  balance: number;
  validTill: string;
}

export interface Coupon {
  id: string;
  label: string; // e.g. "10% OFF" or "₹200 OFF"
  condition: string; // one-line condition
  validTill: string;
  code: string;
  status?: string; // e.g. "All Products", "App Only"
}
