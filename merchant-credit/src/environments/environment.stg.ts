export const environment = {
  name: 'staging',
  production: true,
  version: '1.0.0',
  api: {
    prefix: '/digipay/api',
    version: '2024-03-10',
    agent: 'WEB',
  },
  merchantUrl: 'https://demo-seller.digikala.com/pwa/invoice',
  feeCallbackUrl: 'https://uatweb.mydigipay.info/merchant-credit/registration-v2/callback/fee/{CREDIT}',
  signatureCallbackUrl: 'https://uatweb.mydigipay.info/merchant-credit/registration-v2/{CREDIT}/step/signature/callback',
  google_tag_manager_id: 'GTM-PS2XTV5J',
  intrack_config: {
    app_key: 'AAAAKQ',
    auth_key: 'e79aef46-1a9d-449c-a184-f5adbbab19f9',
    public_key: 'BGsjImFouv6gWBSqq8vGpz6nDg0q1KNA2G-HeLMBTF3njYDIugcV8C0c2WpB4HjFzlGi8mLaF2OuiOBXILINTT8=',
    android_auth_key: 'bf4bc749-e147-483c-bd0d-67e0f98f350d',
    ios_auth_key: 'b5183735-ecb0-4d64-9355-10530d3f79f3',
  }
};
