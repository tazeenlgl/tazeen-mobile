export type Category = {
  id: string;
  name: string;
  tint: string;
  // Catalog product whose real photo represents this category. Categories
  // without one keep the `tint` fallback.
  imageProductId?: string;
};

// Mock data for UI development only. Replace with API-sourced categories
// (including real image URLs) once the backend is connected.
export const categories: Category[] = [
  {
    id: 'cotton',
    name: 'Cotton',
    tint: '#CBB7E0',
    imageProductId: 'p-zasmin-jaipuri-cotton',
  },
  {
    id: 'silk',
    name: 'Silk',
    tint: '#E3B8C4',
    imageProductId: 'p-plum-embroidered-palazzo',
  },
  {
    id: 'daily-wear',
    name: 'Daily Wear',
    tint: '#B8CBE0',
    imageProductId: 'p-sage-tiered-anarkali',
  },
];
