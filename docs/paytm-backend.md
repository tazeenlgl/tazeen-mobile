# Paytm backend contract

The app never holds the Paytm merchant key. A small backend signs requests and
verifies results. The app talks to it through `src/services/payment/paytm.ts`.

Source: https://www.paytmpayments.com/docs/all-in-one-sdk/hybrid-apps/react-native

## What you need first

1. A Paytm merchant account. The admin enters the **MID**, **merchant key** and
   staging/live mode in the backend or admin panel (staging and production differ).
2. Put only the backend URL in `src/config/payment.ts`. Until it is set the app
   uses a demo payment that charges nothing.
3. The merchant key stays on the backend and is never sent to the app.

## Flow

1. App: shopper taps Pay. App generates the order id (`TZN-123456`).
2. App -> `POST {backendUrl}/paytm/initiate`
3. Backend calls Paytm **Initiate Transaction API** and returns the `txnToken`.
4. App opens the Paytm app (or Paytm web view) with `startTransaction(...)`.
5. App -> `POST {backendUrl}/paytm/verify`
6. Backend calls Paytm **Transaction Status API** and returns the final status.
7. The app only places the order when status is `TXN_SUCCESS` and the amount
   matches.

## Endpoints the backend must expose

### POST /paytm/initiate

Request:

```json
{ "orderId": "TZN-123456", "amount": "2099.00", "customerId": "9999999999", "phone": "9242712601" }
```

Backend work: call Initiate Transaction with `requestType: "Payment"`, `mid`,
`websiteName`, `orderId`, `txnAmount { value, currency: "INR" }`,
`userInfo { custId }`, and `callbackUrl`. Sign the `body` with the merchant key
(Paytm checksum library) and put the result in `head.signature`.

Staging host: `https://securestage.paytmpayments.com`
Production host: `https://secure.paytmpayments.com`

The callback URL must be
`https://securestage.paytmpayments.com/theia/paytmCallback?ORDER_ID=<orderId>`
(staging) or the `secure.` host (production). The same value is sent back to the
app so it can pass it to the SDK.

Response:

```json
{ "txnToken": "<from Paytm body.txnToken>", "callbackUrl": "https://.../theia/paytmCallback?ORDER_ID=TZN-123456", "mid": "<admin-set MID>", "isStaging": true }
```

### POST /paytm/verify

Request: `{ "orderId": "TZN-123456" }`

Backend work: call Transaction Status (`/v3/order/status`) with a signed body
and return Paytm's `resultInfo.resultStatus` and `txnAmount`.

Response:

```json
{ "status": "TXN_SUCCESS", "amount": "2099.00", "transactionId": "<TXNID>", "message": "Txn Success" }
```

Anything other than `TXN_SUCCESS` is treated as a failed payment. Also check
that `orderId` and `amount` match the order stored on the server.

## Also recommended

- Store orders on the server and mark them paid from Paytm's **webhook**, not
  only from the app, so a closed app does not lose a paid order.
- Recompute the order amount on the server from product prices; never trust the
  amount sent by the app.

## Android / iOS notes

- Android: `paytmpayments-allinone-react-native` is installed; `minSdkVersion`
  is already 24 (docs ask for 18 or higher).
- iOS: run `bundle exec pod install` in `ios/`, and add the URL scheme
  `paytm` + MID under URL Types before testing the Paytm app return.
- Test with the Paytm **staging** app and test credentials before go-live.
