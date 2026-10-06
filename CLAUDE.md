# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tazeen is a **React Native 0.87 / React 19 / TypeScript** mobile app (bare `@react-native-community/cli`, not Expo) — a clothing storefront with rewards, mini-games and an AI suit try-on flow. Node >= 22.11 is required. The app is currently UI-only: auth, products, rewards and leaderboard are all local mock data.

Note: the global `tazeen-efficient-dev` skill mentions Flutter commands (`flutter analyze`, `flutter run`). They do not apply here; this is not a Flutter project. Use the npm commands below.

## Commands

```sh
npm start                 # Metro dev server
npm run android           # build + run on Android device/emulator (Metro must be running)
npm run ios               # iOS; run `bundle exec pod install` in ios/ after native dep changes
npm run lint              # eslint .
npm test                  # jest (preset @react-native/jest-preset)
npx jest __tests__/App.test.tsx            # single test file
npx jest -t "<test name>"                  # single test by name
npx tsc --noEmit          # type check (no script defined)
```

Android release/assemble builds go through `android/gradlew` (`assembleRelease`).

## Architecture

- **Entry**: `index.js` -> `App.tsx` -> `SafeAreaProvider` > `CartProvider` > `AuthNavigator`.
- **No navigation library.** `src/navigation/AuthNavigator.tsx` is a hand-rolled router: a single `screen` state holding an `AuthScreen` string union, rendered via conditionals. Consequences when adding or changing a screen:
  - Add the key to the `AuthScreen` union, render it in the navigator, **and** add its case to the `BackHandler` `hardwareBackPress` handler (back behavior is hardcoded per screen).
  - Return targets are tracked manually (`cartReturn`, `detailsReturn`); passed data (current product, try-on product/photo URI) lives in navigator state and is handed to screens as props.
  - `AuthNavigator` also owns `AuthProvider` and the side drawer.
- **State**: React context only — `src/context/AuthContext.tsx` (in-memory, fake login, nothing persisted) and `CartContext.tsx`. No backend, no persistence.
- **Data**: `src/data/*.ts` are static mock catalogs typed by `src/types/*`. Product images are bundled from `src/assets/products/...` (typed via `src/types/images.d.ts`).
- **Theme**: use `src/theme/colors.ts` and `typography.ts` rather than hardcoded values.
- **Components** are grouped by feature under `src/components/<feature>/`; screens in `src/screens/`.

### Try-on flow (the non-trivial part)

`SuitTryOnCapture` -> `SuitTryOnPreview` -> `SuitTryOnResult`, launched from `ProductDetails`.
- `components/tryon/TryOnCamera.tsx` uses `react-native-vision-camera` v5 with `react-native-vision-camera-face-detector`; `services/tryOn/faceCaptureQuality.ts` scores face metrics before allowing capture.
- `services/tryOn/generateTryOnResult.ts` is a **mock** (1.8s delay, returns the product's model image). The `TryOnRequest`/`TryOnResult` types in `types/tryOn.ts` are intended to stay stable when a real backend face-swap is wired in, so screens should not need changes.
- Native requirements: camera permission and camera `uses-feature` entries in `AndroidManifest.xml`; `react-native-worklets` Babel plugin is enabled in `babel.config.js` (required by vision-camera frame processors) — keep it last in the plugin list. Native modules also need `react-native-nitro-modules`.

## Repo hygiene

Temporary development/debug artifacts — root `*.png` screenshots, root `*.xml` UI dumps, `android/*_log*.txt` build logs and `dist/` — are git-ignored (see `.gitignore`) and must not be committed. Real images live under `src/assets/` and are not ignored. The `patches/` directory is currently empty.
