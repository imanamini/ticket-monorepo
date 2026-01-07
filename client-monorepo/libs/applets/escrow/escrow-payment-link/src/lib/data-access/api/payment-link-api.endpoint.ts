const base = 'payment/marketplace/payment-links';

export const PAYMENT_LINK_ENDPOINT = {
  base: `${base}`,
  create: `${base}/divar/create-link`,
  requestInfo: (requestId: string) => `${base}/divar/request-info/${requestId}`,
  linkInfoById: (linkId: string) => `${base}/divar/link-info/${linkId}`,
} as const;
