// Mock coupon rules. A real backend would validate these server-side.
export type Coupon = {
  code: string;
  description: string;
  minOrder: number;
  // Percent off the payable amount, capped at `maxOff` when set.
  percentOff?: number;
  flatOff?: number;
  maxOff?: number;
  freeDelivery?: boolean;
};

export const coupons: Coupon[] = [
  { code: 'WELCOME10', description: '10% off up to ₹300', minOrder: 999, percentOff: 10, maxOff: 300 },
  { code: 'TAZEEN200', description: '₹200 off on orders above ₹1,999', minOrder: 1999, flatOff: 200 },
  { code: 'FREESHIP', description: 'Free delivery on any order', minOrder: 0, freeDelivery: true },
];

export type CouponResult =
  | { ok: true; coupon: Coupon; amountOff: number }
  | { ok: false; message: string };

export const applyCoupon = (rawCode: string, payable: number): CouponResult => {
  const code = rawCode.trim().toUpperCase();
  const coupon = coupons.find(item => item.code === code);
  if (!coupon) {
    return { ok: false, message: 'This code is not valid.' };
  }
  if (payable < coupon.minOrder) {
    return {
      ok: false,
      message: `Add ₹${(coupon.minOrder - payable).toLocaleString('en-IN')} more to use ${coupon.code}.`,
    };
  }
  let amountOff = coupon.flatOff ?? 0;
  if (coupon.percentOff) {
    amountOff = Math.floor((payable * coupon.percentOff) / 100);
  }
  if (coupon.maxOff) {
    amountOff = Math.min(amountOff, coupon.maxOff);
  }
  return { ok: true, coupon, amountOff: Math.min(amountOff, payable) };
};
