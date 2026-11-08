# Tazeen Backend: Concept & Plan

Status: **proposal, nothing built yet.** The mobile app is ready to consume it (see `HANDOFF-frontend.md`).

## 1. Idea in one paragraph

The backend cannot live inside the mobile app. Secrets (Paytm key) would leak, and data has to be shared between all customers and staff. Instead, **extend the existing live POS at `https://pos.tazeen.in` (on the VPS)** with a mobile API. The POS stays the single source of truth. Its existing **App Admin** section is the control panel; the app only reads and writes through the API.

```
 Tazeen app  <--HTTPS JSON-->  POS server (VPS)  <-->  Database
                                   |   ^
                  /app-admin  -----+   +---- Paytm, Truecaller, Firebase (push)
```

## 2. What the admin panel already has

From the current sidebar: Dashboard, **App Products**, Settings (Terms of Use, Privacy Policy), Offers (Home Page Offer Banner, Today's Banner), Company Info.

These map one-to-one to app screens that are static today:

| Admin page | App content it should drive | Today in the app |
|---|---|---|
| App Products | Product list, details, stock | `src/data/products.ts` |
| Home Page Offer Banner | Home offers carousel | `src/data/homeOffers.ts` |
| Today's Banner | Hero / festive banner | `src/data/heroSlides.ts` |
| Company Info | Contact, address, links | `src/data/company.ts` |
| Terms of Use / Privacy Policy | Legal screens | `TermsOfUseScreen`, `PrivacyPolicyScreen` |

## 3. Phased plan

### Phase 1: Content API (read-only, start here)

Lowest risk: the app only reads; the admin screens already exist.

| Endpoint | Returns |
|---|---|
| `GET /api/v1/products` (`?category=&q=&page=`) | Product list |
| `GET /api/v1/products/{id}` | Product details |
| `GET /api/v1/categories` | Category list |
| `GET /api/v1/banners/home`, `/banners/today` | Offer + hero banners |
| `GET /api/v1/company` | Company info |
| `GET /api/v1/pages/terms`, `/pages/privacy`, `/pages/returns` | Legal text |
| `GET /api/v1/coupons/validate?code=&amount=` | Coupon check (Phase 3 for apply) |
| `GET /api/v1/pincode/{pin}` | Deliverable?, estimate days, COD? |

App work: add an API client, a cache in AsyncStorage (use the existing `usePersistedState` pattern), and fall back to the bundled mock data when offline. Add skeleton loaders.

### Phase 2: Accounts

- `POST /auth/otp/send`, `POST /auth/otp/verify` (SMS OTP) and `POST /auth/truecaller` (server verifies the Truecaller token).
- Returns a short-lived access token plus refresh token. Replaces the fake phone + PIN login (move away from client-side PIN).
- `GET/PUT /me`, `GET/POST/PUT/DELETE /me/addresses`, `GET/PUT /me/wishlist`.
- Admin: Customers list.

### Phase 3: Orders & payment

- `POST /orders` with `{items:[{productId,size,qty}], addressId, couponCode, paymentMethod}`. **Server recomputes prices, discount, delivery fee and stock**, then returns the order.
- `GET /orders`, `GET /orders/{id}`, `POST /orders/{id}/cancel`, `POST /orders/{id}/return`.
- Paytm: `POST /paytm/initiate`, `POST /paytm/verify`, `POST /paytm/webhook` (contract in `docs/paytm-backend.md`).
- Admin: orders list, status updates (Placed -> Packed -> Shipped -> Out for delivery -> Delivered), return approvals, courier + tracking id.
- This ties app orders into the POS inventory so stock stays correct across shop and app.

### Phase 4: Engagement

- Push notifications (Firebase Cloud Messaging) on order status changes; admin can broadcast.
- Coupons managed in admin (replace `data/coupons.ts`).
- Reviews with photos (moderated), referral rewards, wallet, rewards/leaderboard persistence.
- Real AI try-on endpoint behind the existing `TryOnRequest`/`TryOnResult` types.

## 4. Data shapes (match the app's types)

Keep these identical to `src/types/*` so screens need no change.

**Product** (`types/product.ts`)

```json
{
  "id": "p1", "title": "...", "category": "Suits",
  "images": ["https://cdn.../a.jpg"], "imageTint": "#E8DCCB",
  "sizes": ["S","M","L"], "mrp": 4999, "sellingPrice": 3499, "discount": 30,
  "stock": 12, "rating": 4.5, "reviewCount": 38,
  "shortDescription": "...", "keyFeatures": ["..."],
  "offers": ["Extra 15% off on 2"], "offerDetails": [ /* ProductOffer */ ],
  "tryOnEnabled": true, "tryOnModelImage": "https://cdn.../model.png"
}
```

Note: the app currently uses `require()` images. With an API, `image`/`images` become URL strings; the card/gallery components need a small change to accept `{uri}`.

**Order** (`types/order.ts`): `id`, `placedAt`, `status`, `items[{productId,title,size,quantity,unitPrice}]`, `subtotal`, `discount`, `deliveryFee`, `total`, `paymentMethod`, `paymentRef`, address summary, `history{status: ISO date}`, optional `returnRequest`.

**Address** (`types/address.ts`): `label`, `fullName`, `phone`, `line1`, `line2`, `pincode`, `district`, `state`, `isDefault`.

**HomeOffer**: `id`, `title`, `description`, `cta`. **Company**: name, tagline, website, phone, email, addressLines, instagramUrl, facebookUrl, whatsappUrl.

## 5. Admin additions needed (App Admin)

- Products: images upload (multi), sizes, stock, MRP / selling price, offers, try-on flag, publish toggle.
- Categories; banners (image, title, link, schedule start/end, order).
- Rich-text editor for Terms / Privacy / Returns / FAQ.
- Coupons, pincode serviceability, delivery fee and free-delivery threshold, return window days.
- Payments: Paytm **MID, merchant key, staging/live** (stored server-side only, encrypted at rest).
- Orders, returns, customers, notification broadcast.

Business rules the server should own as config (hard-coded in the app today): free delivery >= Rs 999 else Rs 49, 7-day returns, 5-day delivery estimate, coupon rules.

## 6. Cross-cutting rules

- **Server is the authority** on price, stock, coupon and payment status; the app never decides what a customer pays.
- Version the API (`/api/v1`) so old app builds keep working.
- HTTPS only, JWT with refresh, rate limits on OTP/login, input validation, CORS closed to browsers except the admin.
- Images on the VPS or a CDN with resizing; return full URLs.
- Idempotency key on `POST /orders` and payment calls so retries never double-charge.
- Paytm and Truecaller run staging first, then live. Never ship keys in the app.
- Backups and logging on the VPS; separate staging and production databases.

## 7. App-side changes when the API exists

1. `src/config/api.ts` with `baseUrl` (staging/production).
2. `src/services/api/client.ts` (fetch + timeout + auth header + refresh).
3. Replace imports of `data/products`, `homeOffers`, `heroSlides`, `company` with hooks (`useProducts()` etc.) that cache and fall back to mock data.
4. Contexts (`Auth`, `Order`, `Address`, `Wishlist`) sync to the server after Phase 2/3 while keeping the AsyncStorage copy as an offline cache.
5. Set `paymentConfig.backendUrl` to the API base to switch Paytm from demo to live.

## 8. Open questions (needed before building)

1. What is the POS built with (Laravel / Node / Django / other) and which database?
2. Does App Products already store multiple images, sizes, stock and both prices, or only name and price?
3. Do POS `customers` and `orders` tables exist that app orders should join?
4. Who hosts product images (VPS disk, S3, other)?
5. SMS provider for OTP (or Truecaller only)?
6. Courier / shipping partner, if any, for tracking ids?

## 9. Suggested order of work

1. Answer section 8.
2. Phase 1 endpoints + admin fields gaps + app API client (smallest visible win: edit a product or banner in the admin and see it in the app).
3. Phase 2 accounts, then Phase 3 orders + Paytm, then Phase 4.
