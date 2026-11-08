// Paytm payment settings. The merchant ID, merchant key and staging/live mode
// are entered by the admin on the backend, never in the app: the backend
// returns the merchant ID and mode with each payment (docs/paytm-backend.md).
// While `backendUrl` is empty the app runs a demo payment that charges nothing.
export const paymentConfig = {
  // Base URL of Tazeen's backend that exposes /paytm/initiate and /paytm/verify.
  backendUrl: '',
  // iOS only: URL scheme used to return from the Paytm app, e.g. 'tazeen://'.
  urlScheme: '',
};

export const isPaytmConfigured = (): boolean =>
  paymentConfig.backendUrl.length > 0;
