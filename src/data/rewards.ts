import type { Coupon, GiftCard } from '../types/rewards';

// Mock data for UI development only — replace with API-sourced rewards
// once the backend is connected.
export const giftCards: GiftCard[] = [
  {
    id: 'gc1',
    holderName: 'Ayesha',
    cardNumber: '5241 8830 1147 4821',
    balance: 500,
    validTill: '31 Dec 2026',
  },
  {
    id: 'gc2',
    holderName: 'Ayesha',
    cardNumber: '5241 9021 3387 2096',
    balance: 1200,
    validTill: '15 Mar 2027',
  },
  {
    id: 'gc3',
    holderName: 'Ayesha',
    cardNumber: '5241 1124 7765 5509',
    balance: 150,
    validTill: '30 Jun 2026',
  },
];

export const coupons: Coupon[] = [
  {
    id: 'c1',
    label: '10% OFF',
    condition: 'Applicable above ₹500',
    validTill: '31 Oct 2026',
    code: 'TAZEEN10',
    status: 'All Products',
  },
  {
    id: 'c2',
    label: '₹200 OFF',
    condition: 'Applicable above ₹1,499',
    validTill: '15 Nov 2026',
    code: 'TAZEEN200',
    status: 'App Only',
  },
  {
    id: 'c3',
    label: '15% OFF',
    condition: 'Applicable on Suits category',
    validTill: '20 Dec 2026',
    code: 'SUITS15',
    status: 'Suits Only',
  },
  {
    id: 'c4',
    label: 'Free Delivery',
    condition: 'No minimum order value',
    validTill: '31 Jan 2027',
    code: 'FREESHIP',
  },
];

export const walletBalance = 320;
export const pointsBalance = 1250;
