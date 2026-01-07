export const environment = {
  name: 'production',
  appName: 'website',
  base_url: '/digipay/api/app/store/web',
  production: true,
  api: {
    prefix: '/api',
    host: 'https://www.mydigipay.com',
    agent: '',
    version: '',
    username: '',
    password: '',
  },
  api_core: {
    url: '/digipay/api',
    username: 'website-client-id',
    password: 'website-client-secret-200e6c87-abcd-444f-8a82-887aa99742a0',
    version: '2025-01-01',
  },
  intrackRestConfig: {
    licenseCode: 'AAAAeQ',
    host: 'https://api.intrack.ir/',
    apiKey: '79efd949-27d6-48cf-8a78-9e7fb35dceab',
  },
  intrackConfig: {
    app_key: 'AAAAeQ',
    auth_key: '37d18dc1-4f9a-4c90-af48-e599f288397e',
    public_key: 'BGo62NtHnoQ3p38ApWww7f6QNf_l3MQ0GiLdvo_87z2D6harVPceaCSwnJov77qnfgJPtqbixrUR3ql177Ga9gI=',
  },
  pay_prefix: '',
  redis: {
    host: 'redis-1',
    port: '6379',
  },
  ssrCacheEnabled: true,
  ssrCacheTTL: 3600,
  config: {
    redirectButtonCountDownTime: 60,
  },
  appUrl: 'https://app.mydigipay.com',
  mapKey: '2XfZItOluM7JHnmwX1tg',
  mapBaseUrl: 'https://tile.openstreetmap.org',
  sentry_config: {
    dsn: 'https://f0e6c738f2374d21b5693251c9af1039@crashlytics.mydigipay.com/105',
    target: ['https://www.mydigipay.com'],
    tracesSampleRate: 1,
  },
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
  digipay_version: '2025-01-01',
};
