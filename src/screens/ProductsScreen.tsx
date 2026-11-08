import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePersistedState } from '../utils/storage';
import { colors } from '../theme/colors';
import TopBar from '../components/common/TopBar';
import BottomNavigation from '../components/home/BottomNavigation';
import CategoryFilter from '../components/products/CategoryFilter';
import ProductFilterBar from '../components/products/ProductFilterBar';
import ProductCard from '../components/products/ProductCard';
import ProductSortFilterSheet from '../components/products/ProductSortFilterSheet';
import type { SheetMode } from '../components/products/ProductSortFilterSheet';
import { products } from '../data/products';
import { productCategories } from '../data/productCategories';
import type { Product } from '../types/product';
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  collectSizes,
  countActiveFilters,
  filterAndSortProducts,
} from '../utils/productFilters';
import type { ProductFilters } from '../utils/productFilters';

type ProductsScreenProps = {
  drawerOpen: boolean;
  onMenuPress: () => void;
  onDrawerClose: () => void;
  onNavigate?: (key: string) => void;
  onSelectProduct: (product: Product) => void;
  onCartPress: () => void;
};

const SIDE_PADDING = 20;
const COLUMN_GAP = 14;
const TABLET_BREAKPOINT = 600;
const MAX_CONTENT_WIDTH = 1100;
const availableSizes = collectSizes(products);

const SUGGESTED_SEARCHES = ['Anarkali', 'Palazzo', 'Embroidered', 'Cotton', 'Sharara'];

export default function ProductsScreen({
  onMenuPress,
  onNavigate,
  onSelectProduct,
  onCartPress,
}: ProductsScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeNav, setActiveNav] = useState('products');
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recent, setRecent] = usePersistedState<string[]>('recentSearches', []);
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const navBarBottomOffset = insets.bottom + 16;
  const navBarClearance = navBarBottomOffset + 80;

  const numColumns = width >= TABLET_BREAKPOINT ? 3 : 2;
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - SIDE_PADDING * 2;
  const cardWidth = Math.floor(
    (contentWidth - COLUMN_GAP * (numColumns - 1)) / numColumns,
  );

  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [filters],
  );

  const sortLabel =
    filters.sort === 'relevance'
      ? undefined
      : SORT_OPTIONS.find(option => option.key === filters.sort)?.label;

  const updateFilters = (patch: Partial<ProductFilters>) =>
    setFilters(current => ({ ...current, ...patch }));

  const toggleSize = (size: string) =>
    setFilters(current => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter(item => item !== size)
        : [...current.sizes, size],
    }));

  const clearSheetFilters = () =>
    updateFilters({ sizes: [], inStockOnly: false });

  const resetAll = () => setFilters(DEFAULT_FILTERS);

  const toggleSearch = () => {
    if (searchOpen) {
      updateFilters({ query: '' });
    }
    setSearchOpen(open => !open);
  };

  const handleNavChange = (key: string) => {
    setActiveNav(key);
    onNavigate?.(key);
  };

  return (
    <View style={styles.flex}>
      <FlatList
        // numColumns cannot change on a mounted FlatList, so remount on change.
        key={`columns-${numColumns}`}
        data={visibleProducts}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.column}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: navBarClearance,
          },
        ]}
        ListHeaderComponent={
          <View>
            <TopBar
              title="Products"
              onMenuPress={onMenuPress}
              onCartPress={onCartPress}
              rightAccessory={
                <Pressable
                  onPress={toggleSearch}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={searchOpen ? 'Close search' : 'Search products'}
                >
                  <Text style={styles.searchIcon}>
                    {searchOpen ? '✕' : '\u{1F50D}'}
                  </Text>
                </Pressable>
              }
            />

            {searchOpen && (
              <TextInput
                style={styles.searchInput}
                value={filters.query}
                onChangeText={query => updateFilters({ query })}
                placeholder="Search suits, kurties, pants..."
                placeholderTextColor={colors.placeholder}
                autoFocus
                returnKeyType="search"
                clearButtonMode="while-editing"
                onSubmitEditing={() => {
                  const term = filters.query.trim();
                  if (term) {
                    setRecent(current =>
                      [term, ...current.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 6),
                    );
                  }
                }}
              />
            )}

            {searchOpen && filters.query.trim() === '' && (
              <View style={styles.suggestRow}>
                {(recent.length > 0 ? recent : SUGGESTED_SEARCHES).map(term => (
                  <Pressable
                    key={term}
                    style={styles.suggestChip}
                    onPress={() => updateFilters({ query: term })}
                  >
                    <Text style={styles.suggestText}>{recent.length > 0 ? '↺ ' : ''}{term}</Text>
                  </Pressable>
                ))}
                {recent.length > 0 && (
                  <Pressable onPress={() => setRecent([])}>
                    <Text style={styles.suggestClear}>Clear</Text>
                  </Pressable>
                )}
              </View>
            )}

            <View style={styles.categoryWrap}>
              <CategoryFilter
                categories={productCategories}
                activeCategoryId={filters.categoryId}
                onSelect={categoryId => updateFilters({ categoryId })}
              />
            </View>

            <ProductFilterBar
              activeFilterCount={countActiveFilters(filters)}
              sortLabel={sortLabel}
              onFilterPress={() => setSheetMode('filter')}
              onSortPress={() => setSheetMode('sort')}
            />

            <Text style={styles.resultCount}>
              {visibleProducts.length}{' '}
              {visibleProducts.length === 1 ? 'product' : 'products'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyBody}>
              Try a different search or clear your filters.
            </Text>
            <Pressable style={styles.emptyButton} onPress={resetAll}>
              <Text style={styles.emptyButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={onSelectProduct}
          />
        )}
      />

      <BottomNavigation
        activeKey={activeNav}
        onChange={handleNavChange}
        bottomOffset={navBarBottomOffset}
      />

      <ProductSortFilterSheet
        mode={sheetMode}
        sort={filters.sort}
        sizes={filters.sizes}
        availableSizes={availableSizes}
        inStockOnly={filters.inStockOnly}
        onSortChange={sort => updateFilters({ sort })}
        onToggleSize={toggleSize}
        onInStockChange={inStockOnly => updateFilters({ inStockOnly })}
        onClear={clearSheetFilters}
        onClose={() => setSheetMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 },
  suggestChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  suggestText: { fontSize: 12, color: colors.heading },
  suggestClear: { fontSize: 12, fontWeight: '700', color: colors.primary },
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: SIDE_PADDING,
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  searchIcon: {
    fontSize: 18,
    color: colors.heading,
  },
  searchInput: {
    height: 46,
    marginTop: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 15,
    color: colors.heading,
  },
  categoryWrap: {
    marginTop: 12,
    marginBottom: 12,
  },
  resultCount: {
    marginBottom: 12,
    fontSize: 12,
    color: colors.textSecondary,
  },
  column: {
    marginBottom: COLUMN_GAP,
    columnGap: COLUMN_GAP,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.heading,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
