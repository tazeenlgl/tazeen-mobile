import type { ImageSourcePropType } from 'react-native';

// Suit photo catalog. Each entry's `images` come from the shopper-supplied
// product photos copied into src/assets/products/suits/<slug>/.
export type SuitCatalogEntry = {
  slug: string;
  title: string;
  imageTint: string;
  mrp: number;
  sellingPrice: number;
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: ImageSourcePropType[];
};

export const suitCatalog: SuitCatalogEntry[] = [
  {
    slug: 'teal-embroidered-palazzo',
    title: 'Teal Embroidered Palazzo Suit Set',
    imageTint: '#9CC3C7',
    mrp: 3499,
    sellingPrice: 2099,
    description:
      'Rich teal kurta with thread embroidery, palazzo and a matching dupatta.',
    stock: 14,
    rating: 4.6,
    reviewCount: 64,
    images: [
      require('../assets/products/suits/teal-embroidered-palazzo/1.jpeg'),
    ],
  },
  {
    slug: 'brown-embroidered-straight',
    title: 'Brown Embroidered Straight Suit Set',
    imageTint: '#CDB5A0',
    mrp: 3299,
    sellingPrice: 1999,
    description:
      'Warm brown straight kurta with yoke embroidery, matching bottom and dupatta.',
    stock: 9,
    rating: 4.5,
    reviewCount: 48,
    images: [
      require('../assets/products/suits/brown-embroidered-straight/1.jpeg'),
      require('../assets/products/suits/brown-embroidered-straight/2.jpeg'),
    ],
  },
  {
    slug: 'plum-embroidered-palazzo',
    title: 'Plum Embroidered Palazzo Suit Set',
    imageTint: '#C9A9CF',
    mrp: 3599,
    sellingPrice: 2199,
    description:
      'Deep plum kurta with embroidered neckline, palazzo and a sheer dupatta.',
    stock: 11,
    rating: 4.7,
    reviewCount: 72,
    images: [
      require('../assets/products/suits/plum-embroidered-palazzo/1.jpeg'),
    ],
  },
  {
    slug: 'blue-printed-palazzo',
    title: 'Blue Printed Palazzo Suit Set',
    imageTint: '#A9BFDF',
    mrp: 3199,
    sellingPrice: 1899,
    description:
      'Printed blue kurta with matching palazzo and a bandhani-style dupatta.',
    stock: 16,
    rating: 4.4,
    reviewCount: 39,
    images: [
      require('../assets/products/suits/blue-printed-palazzo/1.jpeg'),
    ],
  },
  {
    slug: 'teal-block-print-anarkali',
    title: 'Teal Block Print Anarkali Set',
    imageTint: '#9ED0D6',
    mrp: 3999,
    sellingPrice: 2399,
    description:
      'Flared teal Anarkali in a block print with a printed dupatta.',
    stock: 8,
    rating: 4.6,
    reviewCount: 81,
    images: [
      require('../assets/products/suits/teal-block-print-anarkali/1.jpeg'),
    ],
  },
  {
    slug: 'rose-block-print-anarkali',
    title: 'Rose Block Print Anarkali Set',
    imageTint: '#EBB6C6',
    mrp: 3999,
    sellingPrice: 2399,
    description:
      'Soft rose Anarkali with a gathered yoke, block print and dupatta.',
    stock: 10,
    rating: 4.5,
    reviewCount: 57,
    images: [
      require('../assets/products/suits/rose-block-print-anarkali/1.jpeg'),
    ],
  },
  {
    slug: 'sage-tiered-anarkali',
    title: 'Sage Tiered Anarkali Set',
    imageTint: '#C6D6CE',
    mrp: 4299,
    sellingPrice: 2599,
    description:
      'Tiered sage Anarkali with delicate print and a coordinated dupatta.',
    stock: 7,
    rating: 4.7,
    reviewCount: 66,
    images: [
      require('../assets/products/suits/sage-tiered-anarkali/1.jpeg'),
    ],
  },
  {
    slug: 'mustard-wrap-neck',
    title: 'Mustard Wrap Neck Suit Set',
    imageTint: '#E8CB78',
    mrp: 3299,
    sellingPrice: 1949,
    description:
      'Mustard kurta with wrap neckline and border detail, bottom and dupatta.',
    stock: 12,
    rating: 4.4,
    reviewCount: 43,
    images: [
      require('../assets/products/suits/mustard-wrap-neck/1.jpeg'),
    ],
  },
  {
    slug: 'royal-blue-kurta-palazzo',
    title: 'Royal Blue Kurta Palazzo Set',
    imageTint: '#9DB8DE',
    mrp: 2799,
    sellingPrice: 1649,
    description:
      'Royal blue kurta with zari border, paired with wide palazzo.',
    stock: 18,
    rating: 4.3,
    reviewCount: 35,
    images: [
      require('../assets/products/suits/royal-blue-kurta-palazzo/1.jpeg'),
    ],
  },
  {
    slug: 'mustard-flared-anarkali',
    title: 'Mustard Flared Anarkali Set',
    imageTint: '#E6C46A',
    mrp: 4199,
    sellingPrice: 2499,
    description:
      'Festive mustard Anarkali with a full flare and gold border.',
    stock: 6,
    rating: 4.8,
    reviewCount: 92,
    images: [
      require('../assets/products/suits/mustard-flared-anarkali/1.jpeg'),
    ],
  },
  {
    slug: 'pista-green-cord-set',
    title: 'Pista Green Embroidered Co-ord Set',
    imageTint: '#CFE0C0',
    mrp: 3399,
    sellingPrice: 1999,
    description:
      'Pista green top with embroidered detail and matching straight pants.',
    stock: 13,
    rating: 4.5,
    reviewCount: 51,
    images: [
      require('../assets/products/suits/pista-green-cord-set/1.jpeg'),
    ],
  },
  {
    slug: 'orange-embroidered',
    title: 'Orange Embroidered Suit Set',
    imageTint: '#F0B891',
    mrp: 3699,
    sellingPrice: 2199,
    description:
      'Vibrant orange kurta with floral embroidery, bottom and dupatta.',
    stock: 9,
    rating: 4.6,
    reviewCount: 60,
    images: [
      require('../assets/products/suits/orange-embroidered/1.jpeg'),
    ],
  },
  {
    slug: 'rust-embroidered',
    title: 'Rust Embroidered Suit Set',
    imageTint: '#D9A38C',
    mrp: 3599,
    sellingPrice: 2149,
    description:
      'Earthy rust kurta with embroidered neckline and a net dupatta.',
    stock: 10,
    rating: 4.5,
    reviewCount: 46,
    images: [
      require('../assets/products/suits/rust-embroidered/1.jpeg'),
    ],
  },
  {
    slug: 'teal-ombre',
    title: 'Teal Ombre Floral Suit Set',
    imageTint: '#C2DAD8',
    mrp: 3899,
    sellingPrice: 2299,
    description:
      'Ombre teal-to-ivory suit with hand-painted floral accents.',
    stock: 5,
    rating: 4.4,
    reviewCount: 28,
    images: [
      require('../assets/products/suits/teal-ombre/1.jpeg'),
    ],
  },
  {
    slug: 'pink-ombre',
    title: 'Pink Ombre Floral Suit Set',
    imageTint: '#F2CFD6',
    mrp: 3899,
    sellingPrice: 2299,
    description:
      'Ombre blush suit with delicate floral work and a matching dupatta.',
    stock: 6,
    rating: 4.6,
    reviewCount: 33,
    images: [
      require('../assets/products/suits/pink-ombre/1.jpeg'),
    ],
  },
  {
    slug: 'beige-embroidered',
    title: 'Beige Embroidered Suit Set',
    imageTint: '#DDD0BC',
    mrp: 3299,
    sellingPrice: 1949,
    description:
      'Neutral beige suit with a subtle embroidered yoke and a soft dupatta.',
    stock: 15,
    rating: 4.3,
    reviewCount: 29,
    images: [
      require('../assets/products/suits/beige-embroidered/1.jpeg'),
    ],
  },
  {
    slug: 'olive-embroidered',
    title: 'Olive Embroidered Suit Set',
    imageTint: '#B9C79B',
    mrp: 3399,
    sellingPrice: 1999,
    description:
      'Olive green suit with embroidered neckline, bottom and chiffon dupatta.',
    stock: 12,
    rating: 4.5,
    reviewCount: 37,
    images: [
      require('../assets/products/suits/olive-embroidered/1.jpeg'),
    ],
  },
  {
    slug: 'pink-floral-sharara',
    title: 'Pink Floral Sharara Suit Set',
    imageTint: '#F29BB5',
    mrp: 4999,
    sellingPrice: 2999,
    description:
      'Hot-pink floral kurta with a flared sharara and a gota-trim dupatta.',
    stock: 8,
    rating: 4.8,
    reviewCount: 118,
    images: [
      require('../assets/products/suits/pink-floral-sharara/1.jpeg'),
      require('../assets/products/suits/pink-floral-sharara/2.jpeg'),
      require('../assets/products/suits/pink-floral-sharara/3.jpeg'),
      require('../assets/products/suits/pink-floral-sharara/4.jpeg'),
      require('../assets/products/suits/pink-floral-sharara/5.jpeg'),
    ],
  },
  {
    slug: 'yellow-floral-sharara',
    title: 'Yellow Floral Sharara Suit Set',
    imageTint: '#EBDD7A',
    mrp: 4999,
    sellingPrice: 2999,
    description:
      'Sunny yellow floral kurta with a flared sharara and a lemon dupatta.',
    stock: 7,
    rating: 4.7,
    reviewCount: 95,
    images: [
      require('../assets/products/suits/yellow-floral-sharara/1.jpeg'),
      require('../assets/products/suits/yellow-floral-sharara/2.jpeg'),
      require('../assets/products/suits/yellow-floral-sharara/3.jpeg'),
    ],
  },
];
