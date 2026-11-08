// Serif for display text gives the boutique feel; resolves to the platform
// serif until a custom font (e.g. Playfair Display) is bundled.
export const displayFont = 'serif';

export const typography = {
  greeting: { fontFamily: displayFont, fontSize: 30, fontWeight: '700' as const },
  welcome: { fontFamily: displayFont, fontSize: 30, fontWeight: '700' as const },
  subtitle: { fontSize: 14, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '500' as const },
  input: { fontSize: 15, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
  link: { fontSize: 13, fontWeight: '600' as const },
  logo: { fontFamily: displayFont, fontSize: 20, fontWeight: '700' as const },
};
