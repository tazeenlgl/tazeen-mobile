import { paymentConfig, isPaytmConfigured } from '../../config/payment';

export type PaymentRequest = {
  orderId: string;
  // Amount in rupees, e.g. 2099.
  amount: number;
  customerId: string;
  phone: string;
};

export type PaymentResult =
  | { ok: true; transactionId: string }
  | { ok: false; message: string };

const REQUEST_TIMEOUT_MS = 20000;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${paymentConfig.backendUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// Paytm wants the amount as a string with two decimals and no separators.
const formatAmount = (amount: number): string => amount.toFixed(2);

// Demo payment used until Paytm is configured: always succeeds, charges nothing.
async function payDemo(): Promise<PaymentResult> {
  await new Promise<void>(resolve => setTimeout(resolve, 1500));
  return { ok: true, transactionId: `DEMO-${Date.now()}` };
}

// Paytm All-in-One flow:
//  1. backend: Initiate Transaction -> txnToken
//  2. app: open the Paytm app (or web view) with that token
//  3. backend: Transaction Status API is the final word on success
export async function payWithPaytm(request: PaymentRequest): Promise<PaymentResult> {
  if (!isPaytmConfigured()) {
    return payDemo();
  }
  const amount = formatAmount(request.amount);

  try {
    const init = await postJson<{
      txnToken: string;
      callbackUrl: string;
      mid: string;
      isStaging: boolean;
    }>(
      '/paytm/initiate',
      {
        orderId: request.orderId,
        amount,
        customerId: request.customerId,
        phone: request.phone,
      },
    );

    // Loaded here so the demo mode and tests never touch the native module.
    const AllInOneSDKManager = require('paytmpayments-allinone-react-native').default;
    await AllInOneSDKManager.startTransaction(
      request.orderId,
      init.mid,
      init.txnToken,
      amount,
      init.callbackUrl,
      init.isStaging,
      false,
      paymentConfig.urlScheme,
    );

    const status = await postJson<{
      status: string;
      amount: string;
      transactionId?: string;
      message?: string;
    }>('/paytm/verify', { orderId: request.orderId });

    if (status.status !== 'TXN_SUCCESS') {
      return { ok: false, message: status.message || 'The payment was not completed.' };
    }
    if (Number(status.amount) !== Number(amount)) {
      return { ok: false, message: 'The paid amount did not match the order.' };
    }
    return { ok: true, transactionId: status.transactionId ?? request.orderId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: message || 'The payment could not be completed.' };
  }
}
