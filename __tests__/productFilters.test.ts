import { products } from '../src/data/products';
import {
  DEFAULT_FILTERS,
  collectSizes,
  countActiveFilters,
  filterAndSortProducts,
} from '../src/utils/productFilters';

describe('filterAndSortProducts', () => {
  it('returns every product with default filters', () => {
    expect(filterAndSortProducts(products, DEFAULT_FILTERS)).toHaveLength(
      products.length,
    );
  });

  it('filters by search query on title', () => {
    const target = products[0];
    const word = target.title.split(' ')[0].toLowerCase();
    const result = filterAndSortProducts(products, { ...DEFAULT_FILTERS, query: word });
    expect(result.some(item => item.id === target.id)).toBe(true);
    expect(
      result.every(item =>
        `${item.title} ${item.category}`.toLowerCase().includes(word),
      ),
    ).toBe(true);
  });

  it('returns nothing for an unmatched query', () => {
    expect(
      filterAndSortProducts(products, { ...DEFAULT_FILTERS, query: 'zzzz-none' }),
    ).toEqual([]);
  });

  it('sorts by price ascending and descending', () => {
    const low = filterAndSortProducts(products, { ...DEFAULT_FILTERS, sort: 'priceLow' });
    const high = filterAndSortProducts(products, { ...DEFAULT_FILTERS, sort: 'priceHigh' });
    expect(low[0].sellingPrice).toBeLessThanOrEqual(low[low.length - 1].sellingPrice);
    expect(high[0].sellingPrice).toBeGreaterThanOrEqual(high[high.length - 1].sellingPrice);
  });

  it('applies the size filter', () => {
    const size = collectSizes(products)[0];
    const result = filterAndSortProducts(products, { ...DEFAULT_FILTERS, sizes: [size] });
    expect(result.every(item => item.sizes.includes(size))).toBe(true);
  });

  it('does not mutate the source array when sorting', () => {
    const before = products.map(item => item.id);
    filterAndSortProducts(products, { ...DEFAULT_FILTERS, sort: 'priceHigh' });
    expect(products.map(item => item.id)).toEqual(before);
  });

  it('counts active sheet filters', () => {
    expect(countActiveFilters({ ...DEFAULT_FILTERS, sizes: ['S', 'M'], inStockOnly: true })).toBe(3);
  });
});
