# Tazeen Mobile: Frontend Handoff

State of the app as of 2026-11-08. Repo: https://github.com/tazeenlgl/tazeen-mobile (branch `main`).

## 1. What this is

A clothing storefront for Android (iOS untouched) built with **React Native 0.87, React 19, TypeScript**, bare CLI (not Expo). Node >= 22.11.

The app is **front-end complete but backend-less**. All catalog content is static mock data in `src/data/*`. Customer data (cart, orders, addresses, wishlist, login) is saved on the phone only, in AsyncStorage. See `docs/BACKEND-concept.md` for the server plan.

## 2. Run it

```sh
npm install
npm start                 # Metro
npm run android           # build + install (Metro must be running)
npx tsc --noEmit          # type check
npm run lint              # only known errors: unused drawerOpen/onDrawerClose props
npm test
```

Emulator notes: Metro on 8081. After install, force-stop and start `com.tazeenmobile/.MainActivity`, then wait 45-75 s for the first bundle. Test login: phone `9999999999`, PIN `1234`.

## 3. Architecture

- **Entry**: `index.js` -> `App.tsx` -> `SafeAreaProvider` -> `CartProvider` -> `AuthNavigator`.
- **No navigation library.** `src/navigation/AuthNavigator.tsx` is a hand-rolled router: one `screen` state typed by an `AuthScreen` union.
  When adding a screen: (1) add the key to the union, (2) render it, (3) add its case to the `BackHandler` handler, (4) track any return target manually (`cartReturn`, `detailsReturn`, `addressesReturn`, `orderReturn`, `policyReturn`).
- **Provider nesting** (inside `AuthNavigator`): Auth > Address > Order > Notification > Wishlist (Cart is in `App.tsx`).
- **State**: React context only, persisted via `usePersistedState` in `src/utils/storage.ts` (AsyncStorage, keys prefixed `tazeen.`). It hydrates first, then writes back, so it never overwrites saved data with defaults.
- **Theme**: `src/theme/colors.ts`, `typography.ts` (ivory / plum / gold). `displayFont = 'serif'` is a placeholder; no custom fonts are bundled.
- **Data**: `src/data/*.ts` typed by `src/types/*`. Product images are bundled with `require()`.

## 4. Features built

| Area | Where | Notes |
|---|---|---|
| Home | `HomeScreen.tsx`, `components/home/*` | Auto-sliding hero carousel (`HeroProduct`, up to 6 products, 4 s), offers carousel, category chips, notification bell with unread badge, side drawer |
| Catalog | `ProductsScreen.tsx` | Search, sort, filter, recent and suggested searches (persisted) |
| Product details | `ProductDetailsScreen.tsx` | Swipeable gallery, size selector, size guide sheet, fit note, offers carousel, delivery/pincode checker, "Complete the look", Buy now, wishlist heart, AI suit try-on entry |
| Wishlist | `WishlistContext`, `WishlistScreen`, `HeartButton` | Persisted |
| Cart | `CartContext`, `CartScreen` | Persisted as `{id, productId, size, quantity, appliedOffer}`; re-hydrated from `data/products` |
| Checkout | `CheckoutScreen.tsx` | Address picker, coupons, summary, **Paytm** or **Cash on delivery** |
| Orders | `OrderContext`, `OrdersScreen`, `OrderDetailsScreen`, `OrderConfirmationScreen` | Tracking timeline (Placed -> Packed -> Shipped -> Out for delivery -> Delivered), cancel, history. Has a **demo "simulate next courier update" button** to remove before launch |
| Returns | `ReturnRequestScreen`, `ReturnPolicyScreen` | Return/exchange inside a 7-day window. Policy text is a placeholder |
| Notifications | `NotificationContext`, `NotificationsScreen` | Local only (created on order events). No push yet |
| Help | `HelpScreen.tsx` | WhatsApp, call, email, FAQs (placeholder FAQ text) |
| Account | `AuthContext`, `LoginScreen`, `SignUp`, `ForgotPassword`, `ChangePin`, `ChangePhone`, `Profile`, `Settings` | Persisted login and auto-login on restart. **Fake auth** against local data. PIN is stored unencrypted |
| Addresses | `AddressContext`, `AddressesScreen`, `AddressFormScreen` | Persisted |
| Rewards / games | `RewardsScreen`, `GameHub`, `SpinWin`, `Stopwatch`, `Leaderboard` | Mock data |
| AI try-on | `SuitTryOnCapture/Preview/Result` + `services/tryOn/*` | Camera + face quality scoring are real; `generateTryOnResult` is a **mock** (1.8 s delay) |
| Company / legal | `CompanyDetails`, `AboutTazeen`, `TermsOfUse`, `PrivacyPolicy` | Static text from `data/company.ts` and screens. These are what the POS admin should control |

### Business rules in code (`src/utils/pricing.ts`)

- Free delivery at subtotal >= Rs 999, otherwise Rs 49.
- Return window 7 days. Estimated delivery = order date + 5 days.
- Order ids look like `TZN-123456` (`newOrderId`).
- Coupons (`src/data/coupons.ts`): `WELCOME10` (10% up to Rs 300, min 999), `TAZEEN200` (Rs 200 off, min 1999), `FREESHIP`. **Mock rules; the server must own these later.**

## 5. Integrations

### Paytm (payment)

- `src/services/payment/paytm.ts` -> `payWithPaytm()`. Config in `src/config/payment.ts`: `backendUrl`, `urlScheme`.
- **While `backendUrl` is empty it runs a demo payment** (1.5 s, always succeeds, id `DEMO-<ts>`). No money moves.
- Live flow: `POST {backendUrl}/paytm/initiate` -> Paytm SDK `startTransaction` -> `POST {backendUrl}/paytm/verify`. The app accepts only `TXN_SUCCESS` with a matching amount.
- Merchant ID and key live only on the server (admin-entered). Full contract: `docs/paytm-backend.md`.
- Package: `paytmpayments-allinone-react-native`. iOS still needs `pod install` and the `paytm` URL scheme.

### Truecaller login (Android only)

- Native bridge: `android/app/src/main/java/com/tazeenmobile/TruecallerModule.kt` + `TruecallerPackage.kt` (registered in `MainApplication.kt`). SDK `truecaller-sdk:3.2.0`.
- JS: `src/services/auth/truecaller.ts` does the PKCE code -> token -> userinfo exchange against `oauth-account-noneu.truecaller.com`. `LoginScreen.tsx` calls it and falls back to phone + PIN.
- **Not live yet.** `android/app/src/main/res/values/strings.xml` still holds `REPLACE_WITH_TRUECALLER_CLIENT_ID`. Needed: client ID from the Truecaller console (package `com.tazeenmobile` + signing SHA-1), test on a real phone with Truecaller, then the Play Store permission form. Verified so far: build compiles, and the "not set up" fallback message shows.

## 6. Known gaps / TODO

Not built from the earlier feature lists:

1. Reviews with customer photos (only a rating and count exist)
2. Colour and price filters
3. Real icons and bundled fonts (emoji/text glyphs and the `serif` placeholder today)
4. Skeleton loaders
5. Festive banner
6. Referral rewards
7. "Today's Best Deals" strip with countdown (proposed, not built)

Housekeeping:

- All catalog, banner, coupon and company content is hard-coded, so the admin panel cannot change it yet (see the backend doc).
- Replace placeholder return policy, FAQ and About copy; set real Instagram/Facebook URLs in `data/company.ts`.
- Remove the demo "simulate courier update" button.
- Store the PIN securely (Keychain/Keystore) once a real auth exists, and never keep a raw PIN client-side.
- `tazeen-mobile-main.zip` sits in the repo root (from an upload) and can be deleted.
- iOS is not configured for Paytm or Truecaller.
- Release signing and the Play Store listing are not set up.

## 7. Repo hygiene

Root `*.png`, root `*.xml` UI dumps, `android/*_log*.txt`, `hs_err_pid*.log`, `replay_pid*.log` and `dist/` are git-ignored. Do not commit them.
