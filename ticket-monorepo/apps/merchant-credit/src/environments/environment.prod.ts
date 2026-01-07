export const environment = {
  name: 'production',
  production: true,
  version: '1.0.0',
  api: {
    prefix: '/digipay/api',
    version: '2024-03-10',
    agent: 'WEB',
  },
  merchantUrl: 'https://seller.digikala.com/pwa/invoice',
  feeCallbackUrl: 'https://web.mydigipay.com/merchant-credit/registration-v2/callback/fee/{CREDIT}',
  signatureCallbackUrl: 'https://web.mydigipay.com/merchant-credit/registration-v2/{CREDIT}/step/signature/callback',
  google_tag_manager_id: 'GTM-PS2XTV5J',
  intrack_config: {
    app_key: 'AAAAeQ',
    auth_key: '37d18dc1-4f9a-4c90-af48-e599f288397e',
    public_key: 'BGo62NtHnoQ3p38ApWww7f6QNf_l3MQ0GiLdvo_87z2D6harVPceaCSwnJov77qnfgJPtqbixrUR3ql177Ga9gI=',
    android_auth_key: 'f8efcf8d-3a73-4987-8075-8894d09b87b9',
    ios_auth_key: '511ac095-f4a8-443f-8552-0e9553309261',
  },
};
