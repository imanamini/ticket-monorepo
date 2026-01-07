export const environment = {
  env: 'production',
  app_url: 'https://secure.mydigipay.com/',
  base_url: 'https://api.mydigipay.com/digipay/api',
  agents: {
    web_agent: 'WEB',
    android_agent: 'HYBRID_ANDROID',
    ios_agent: 'HYBRID_IOS',
  },
  client_ids: {
    web_username: 'webapp-client-id',
    android_hybrid_username: 'hybrid-android-client-id',
    ios_hybrid_username: 'hybrid-ios-client-id',
  },
  client_secrets: {
    web_password: 'webapp-client-secret-debee79d-b04d-47ef-8ed5-c32e24ec836e',
    android_hybrid_password: 'hybrid-android-client-secert-ddd6c372-c3a0-4964-8faa-7b57d76f573b',
    ios_hybrid_password: 'hybrid-ios-client-secert-88b40c21-6c9b-42e9-8191-1d1a22664f44',
  },
  intrack_config: {
    app_key: 'AAAAeQ',
    auth_key: '37d18dc1-4f9a-4c90-af48-e599f288397e',
    public_key: 'BGo62NtHnoQ3p38ApWww7f6QNf_l3MQ0GiLdvo_87z2D6harVPceaCSwnJov77qnfgJPtqbixrUR3ql177Ga9gI=',
    android_auth_key: 'f8efcf8d-3a73-4987-8075-8894d09b87b9',
    ios_auth_key: '511ac095-f4a8-443f-8552-0e9553309261',
  },
  sentry_config: {
    dsn: 'https://201b09d1db7fe0be477d7130bcee87bb@crashlytics.mydigipay.com/114',
    target: ['https://plink.mydigipay.com'],
    tracesSampleRate: 1,
  },
  google_tag_manager_id: 'GTM-PS2XTV5J',
  digipay_version: '2025-01-01',
  version_check_period_seconds: '180',
  merchant_registration_url: 'https://business.mydigipay.com/auth/login',
};
