import type { Product } from '../types/product';

export type SortKey = 'relevance' | 'priceLow' | 'priceHigh' | 'discount' | 'rating';

export type ProductFilters = {
  categoryId: string;
  query: string;
  sort: SortKey;
  sizes: string[];
  inStockOnly: boolean;
};

export const DEFAULT_FILTERS: ProductFilters = {
  categoryId: 'all',
  query: '',
  sort: 'relevance',
  sizes: [],
  inStockOnly: false,
};

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'priceLow', label: 'Price: Low to High' },
  { key: 'priceHigh', label: 'Price: High to Low' },
  { key: 'discount', label: 'Biggest Discount' },
  { key: 'rating', label: 'Top Rated' },
];

// Number of sheet-controlled filters in use (sort + sizes + stock), for the
// badge on the Filter/Sort buttons.
export const countActiveFilters = (filters: ProductFilters): number =>
  filters.sizes.length + (filters.inStockOnly ? 1 : 0);

const sorters: Record<SortKey, ((a: Product, b: Product) => number) | null> = {
  relevance: null,
  priceLow: (a, b) => a.sellingPrice - b.sellingPrice,
  priceHigh: (a, b) => b.sellingPrice - a.sellingPrice,
  discount: (a, b) => b.discount - a.discount,
  rating: (a, b) => b.rating - a.rating,
};

export const filterAndSortProducts = (
  products: Product[],
  filters: ProductFilters,
): Product[] => {
  const query = filters.query.trim().toLowerCase();

  const matches = products.filter(product => {
    if (filters.categoryId !== 'all' && product.category !== filters.categoryId) {
      return false;
    }
    if (filters.inStockOnly && product.stock === 0) {
      return false;
    }
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some(size => product.sizes.includes(size))
    ) {
      return false;
    }
    if (query) {
      const haystack = `${product.title} ${product.category}`.toLowerCase();
      return haystack.includes(query);
    }
    return true;
  });

  const compare = sorters[filters.sort];
  return compare ? [...matches].sort(compare) : matches;
};

export const collectSizes = (products: Product[]): string[] => {
  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const unique = Array.from(new Set(products.flatMap(product => product.sizes)));
  return unique.sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
};
