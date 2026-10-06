export type HeroSlide = {
  id: string;
  tint: string;
};

// Mock data for UI development only. Replace with API-sourced hero
// imagery once the backend is connected.
export const heroSlides: HeroSlide[] = [
  { id: 'slide-1', tint: '#D8C7E8' },
  { id: 'slide-2', tint: '#E8D2C7' },
  { id: 'slide-3', tint: '#C7D8E8' },
  { id: 'slide-4', tint: '#D2C7E0' },
];
