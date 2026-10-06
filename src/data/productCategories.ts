export type ProductCategory = {
  id: string;
  label: string;
};

// Mock data for UI development only. Replace with API-sourced
// categories once the backend is connected.
export const productCategories: ProductCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'suits', label: 'Suits' },
  { id: 'kurties', label: 'Kurties' },
  { id: 'pants', label: 'Pants' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottom-wear', label: 'Bottom Wear' },
];
