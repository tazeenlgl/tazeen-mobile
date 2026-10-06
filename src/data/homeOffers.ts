export type HomeOffer = {
  id: string;
  title: string;
  description: string;
  cta: string;
};

// Mock data for UI development only. Replace with API-sourced offers once
// the backend is connected. Order here is the order of the Home carousel.
export const homeOffers: HomeOffer[] = [
  {
    id: 'buy-2-extra-15',
    title: 'Buy 2 → Extra 15% OFF',
    description: 'Add 2 or more products and get an additional 15% OFF.',
    cta: 'Shop Now',
  },
  {
    id: 'buy-1-get-1-half',
    title: 'Buy 1 → Get 1 at 50% OFF',
    description: 'Buy one eligible product and get another at 50% OFF.',
    cta: 'Shop Now',
  },
  {
    id: 'flat-15',
    title: 'Flat 15% OFF',
    description: 'Get 15% OFF on products above ₹999.',
    cta: 'Shop Now',
  },
];
