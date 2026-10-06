import type { ImageSourcePropType } from 'react-native';
import type { ProductOffer } from './offer';

export interface Product {
  id: string;
  image: ImageSourcePropType;
  imageTint: string;
  // Optional real local image gallery for Product Details (swipeable).
  // Products without it keep using the `imageTint` color block as before.
  images?: ImageSourcePropType[];
  title: string;
  category: string;
  sizes: string[];
  mrp: number;
  sellingPrice: number;
  discount: number;
  offers: string[];
  // Structured, backend-ready offer data for the Product Details offer
  // carousel. `offers` (above) stays as-is for the compact product-card
  // and cart-summary offer text.
  offerDetails: ProductOffer[];
  stock: number;

  rating: number;
  reviewCount: number;
  shortDescription: string;
  keyFeatures: string[];

  // Virtual Try-On (Suits only, V1 mock). `tryOnModelImage` is the
  // suit/model base image the customer's face will eventually be
  // composited onto; without it Try It On stays hidden/unavailable.
  tryOnEnabled?: boolean;
  tryOnModelImage?: string;
}
