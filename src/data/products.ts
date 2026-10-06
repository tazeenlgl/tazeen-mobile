import type { Product } from '../types/product';
import type { ProductOffer } from '../types/offer';

type ProductDraft = Omit<Product, 'offerDetails'>;

// Builds the structured, backend-ready offer list for the Product
// Details offer carousel from each product's existing `offers` strings
// plus a couple of standard storewide offers. Mock-only for now.
function buildOfferDetails(product: ProductDraft): ProductOffer[] {
  const offers: ProductOffer[] = product.offers.map((text, index) => {
    const isBulk = text.toLowerCase().includes('buy');
    const bulkUnavailable = isBulk && product.stock > 0 && product.stock < 2;
    return {
      id: `${product.id}-offer-${index}`,
      title: text,
      description: isBulk
        ? 'Add another unit of this product to your cart to unlock this discount.'
        : 'Pay online with any UPI, card, or wallet to get this discount applied at checkout.',
      type: isBulk ? 'bulk' : 'payment',
      value: isBulk ? 'Extra 15% OFF' : '10% OFF',
      eligibility: isBulk ? 'Buy 2 or more units' : 'Prepaid orders only',
      applicable: !bulkUnavailable,
      unavailableReason: bulkUnavailable
        ? 'Only 1 unit left in stock'
        : undefined,
    };
  });

  offers.push({
    id: `${product.id}-offer-bank`,
    title: 'Bank Offer',
    description: '10% instant discount up to ₹150 on Tazeen Bank Card.',
    type: 'bank',
    value: 'Up to ₹150 OFF',
    eligibility: 'Min order ₹999',
    applicable: product.sellingPrice >= 999,
    unavailableReason:
      product.sellingPrice < 999
        ? 'Order value below ₹999 minimum'
        : undefined,
  });

  offers.push({
    id: `${product.id}-offer-coupon`,
    title: 'WELCOME10',
    description: 'Flat 10% off for first-time Tazeen shoppers.',
    type: 'coupon',
    value: '10% OFF',
    eligibility: 'New customers only',
    applicable: true,
  });

  return offers;
}

// Mock data for UI development only. Replace this array with an
// API-sourced product list once the backend is connected — the
// Product type and ProductCard component do not need to change.
const productDrafts: ProductDraft[] = [
  {
    id: 'p1',
    image: { uri: '' },
    imageTint: '#D8C7E8',
    title: 'Embroidered Anarkali Suit Set',
    category: 'suits',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mrp: 2999,
    sellingPrice: 1799,
    discount: 40,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 12,
    rating: 4.5,
    reviewCount: 128,
    shortDescription:
      'A graceful Anarkali suit set with intricate thread embroidery, paired with a matching dupatta for a festive, elegant look.',
    keyFeatures: [
      'Premium georgette fabric',
      'Hand-finished thread embroidery',
      'Includes matching dupatta',
      'Flared Anarkali silhouette',
    ],
    tryOnEnabled: true,
    tryOnModelImage: '#D8C7E8',
  },
  {
    id: 'p2',
    image: { uri: '' },
    imageTint: '#E3B8C4',
    title: 'Printed Straight Kurti',
    category: 'kurties',
    sizes: ['S', 'M', 'L', 'XL'],
    mrp: 999,
    sellingPrice: 599,
    discount: 40,
    offers: [],
    stock: 3,
    rating: 4.2,
    reviewCount: 76,
    shortDescription:
      'A breathable cotton-blend straight kurti with an all-over floral print, perfect for everyday comfort and style.',
    keyFeatures: [
      'Soft cotton-blend fabric',
      'Comfortable straight fit',
      'Breathable for daily wear',
      'Machine washable',
    ],
  },
  {
    id: 'p3',
    image: { uri: '' },
    imageTint: '#B8CBE0',
    title: 'Black Wide-Leg Cargo Pants',
    category: 'pants',
    sizes: ['M', 'L', 'XL', 'XXL'],
    mrp: 999,
    sellingPrice: 359,
    discount: 64,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 0,
    rating: 4.3,
    reviewCount: 94,
    shortDescription:
      'Relaxed wide-leg cargo pants with utility pockets, designed for an easy, contemporary streetwear look.',
    keyFeatures: [
      'Durable cotton twill fabric',
      'Wide-leg relaxed fit',
      'Multiple utility pockets',
      'Elasticated waistband',
    ],
  },
  {
    id: 'p4',
    image: { uri: '' },
    imageTint: '#CFE0C7',
    title: 'Ribbed Knit Crop Top',
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L'],
    mrp: 799,
    sellingPrice: 449,
    discount: 44,
    offers: ['Flat 10% off on prepaid'],
    stock: 8,
    rating: 4.1,
    reviewCount: 52,
    shortDescription:
      'A snug ribbed knit crop top with stretch comfort, ideal for pairing with high-waist bottoms.',
    keyFeatures: [
      'Stretchable ribbed knit',
      'Flattering crop silhouette',
      'Soft, breathable fabric',
      'Easy-care, machine washable',
    ],
  },
  {
    id: 'p5',
    image: { uri: '' },
    imageTint: '#E0D2C7',
    title: 'High-Waist Palazzo Pants',
    category: 'bottom-wear',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mrp: 1299,
    sellingPrice: 849,
    discount: 35,
    offers: [],
    stock: 15,
    rating: 4.6,
    reviewCount: 143,
    shortDescription:
      'Flowy high-waist palazzo pants in a lightweight fabric, offering an elegant drape for both casual and festive wear.',
    keyFeatures: [
      'Lightweight flowy fabric',
      'High-waist comfort fit',
      'Wide flared palazzo cut',
      'Suitable for all-day wear',
    ],
  },
  {
    id: 'p6',
    image: { uri: '' },
    imageTint: '#D2C7E0',
    title: 'Chikankari Cotton Suit Set',
    category: 'suits',
    sizes: ['S', 'M', 'L', 'XL'],
    mrp: 3499,
    sellingPrice: 2099,
    discount: 40,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 5,
    rating: 4.7,
    reviewCount: 211,
    shortDescription:
      'A timeless Chikankari-embroidered cotton suit set, handcrafted for everyday elegance and summer comfort.',
    keyFeatures: [
      '100% pure cotton fabric',
      'Hand Chikankari embroidery',
      'Includes bottom and dupatta',
      'Lightweight and breathable',
    ],
    tryOnEnabled: true,
    tryOnModelImage: '#D2C7E0',
  },
  {
    id: 'p-zasmin-jaipuri-cotton',
    image: { uri: '' },
    imageTint: '#E3D5B8',
    images: [
      require('../assets/products/suits/zasmin-jaipuri-cotton/front.png'),
      require('../assets/products/suits/zasmin-jaipuri-cotton/side.png'),
      require('../assets/products/suits/zasmin-jaipuri-cotton/back.png'),
      require('../assets/products/suits/zasmin-jaipuri-cotton/4.png'),
      require('../assets/products/suits/zasmin-jaipuri-cotton/5.png'),
      require('../assets/products/suits/zasmin-jaipuri-cotton/6.png'),
    ],
    title: 'ZASMIN Jaipuri Cotton Suit',
    category: 'suits',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mrp: 2499,
    sellingPrice: 1499,
    discount: 40,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 14,
    rating: 4.6,
    reviewCount: 87,
    shortDescription:
      'A breathable Jaipuri hand-block print cotton suit set, crafted in traditional Rajasthani motifs for everyday elegance and warm-weather comfort.',
    keyFeatures: [
      '100% pure cotton fabric',
      'Authentic Jaipuri hand-block print',
      'Includes matching bottom and dupatta',
      'Lightweight and breathable for daily wear',
    ],
    tryOnEnabled: true,
    tryOnModelImage: '#E3D5B8',
  },
  {
    id: 'p7',
    image: { uri: '' },
    imageTint: '#E8D2C7',
    title: 'A-Line Floral Kurti with Pocket Detail',
    category: 'kurties',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mrp: 1199,
    sellingPrice: 719,
    discount: 40,
    offers: ['Flat 10% off on prepaid'],
    stock: 20,
    rating: 4.4,
    reviewCount: 168,
    shortDescription:
      'A flattering A-line kurti with a soft floral print and functional side pockets for everyday ease.',
    keyFeatures: [
      'Soft rayon fabric',
      'Flattering A-line cut',
      'Functional side pockets',
      'Fade-resistant print',
    ],
  },
  {
    id: 'p8',
    image: { uri: '' },
    imageTint: '#C7D8E8',
    title: 'Slim Fit Formal Trousers',
    category: 'pants',
    sizes: ['S', 'M', 'L'],
    mrp: 1499,
    sellingPrice: 999,
    discount: 33,
    offers: [],
    stock: 2,
    rating: 4.0,
    reviewCount: 41,
    shortDescription:
      'Tailored slim-fit formal trousers with a crisp finish, designed for office wear and formal occasions.',
    keyFeatures: [
      'Wrinkle-resistant fabric',
      'Tailored slim fit',
      'Mid-rise with belt loops',
      'Machine washable',
    ],
  },
  {
    id: 'p9',
    image: { uri: '' },
    imageTint: '#CBB7E0',
    title: 'Off-Shoulder Georgette Top',
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    mrp: 899,
    sellingPrice: 539,
    discount: 40,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 9,
    rating: 4.3,
    reviewCount: 87,
    shortDescription:
      'A breezy off-shoulder georgette top with a flattering silhouette, perfect for evening outings.',
    keyFeatures: [
      'Flowy georgette fabric',
      'Flattering off-shoulder neckline',
      'Lined for comfortable wear',
      'Pairs well with jeans or skirts',
    ],
  },
  {
    id: 'p10',
    image: { uri: '' },
    imageTint: '#E3C7D2',
    title: 'Pleated Culottes with Belt',
    category: 'bottom-wear',
    sizes: ['M', 'L', 'XL'],
    mrp: 1099,
    sellingPrice: 759,
    discount: 31,
    offers: [],
    stock: 0,
    rating: 4.2,
    reviewCount: 63,
    shortDescription:
      'Pleated culottes with a self-fabric belt, combining the comfort of pants with the flow of a skirt.',
    keyFeatures: [
      'Soft pleated fabric',
      'Wide culotte silhouette',
      'Includes self-fabric belt',
      'Comfortable elasticated back',
    ],
  },
  {
    id: 'p11',
    image: { uri: '' },
    imageTint: '#C7E0D8',
    title: 'Mirror Work Festive Suit Set',
    category: 'suits',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mrp: 4299,
    sellingPrice: 2579,
    discount: 40,
    offers: ['Buy 2 → Extra 15% OFF'],
    stock: 4,
    rating: 4.8,
    reviewCount: 256,
    shortDescription:
      'A festive suit set adorned with intricate mirror work, designed to make a statement at weddings and celebrations.',
    keyFeatures: [
      'Premium silk-blend fabric',
      'Intricate mirror work detailing',
      'Includes bottom and dupatta',
      'Rich festive color palette',
    ],
  },
  {
    id: 'p12',
    image: { uri: '' },
    imageTint: '#E0C7CB',
    title: 'Mandarin Collar Short Kurti',
    category: 'kurties',
    sizes: ['S', 'M', 'L', 'XL'],
    mrp: 849,
    sellingPrice: 509,
    discount: 40,
    offers: ['Flat 10% off on prepaid'],
    stock: 11,
    rating: 4.3,
    reviewCount: 99,
    shortDescription:
      'A smart mandarin-collar short kurti with a tailored fit, easy to style for both work and casual outings.',
    keyFeatures: [
      'Structured cotton-blend fabric',
      'Tailored mandarin collar',
      'Short, versatile length',
      'Easy to pair with pants or jeans',
    ],
  },
];

export const products: Product[] = productDrafts.map(draft => ({
  ...draft,
  offerDetails: buildOfferDetails(draft),
}));
