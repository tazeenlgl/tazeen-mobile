export type OfferType = 'bank' | 'bulk' | 'payment' | 'coupon' | 'seasonal';

export interface ProductOffer {
  id: string;
  title: string;
  description: string;
  type: OfferType;
  value: string;
  eligibility: string;
  applicable: boolean;
  unavailableReason?: string;
}
