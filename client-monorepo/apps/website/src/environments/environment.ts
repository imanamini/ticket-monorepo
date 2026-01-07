// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'dev',
  appName: 'website',
  base_url: '/digipay/api/app/store/web',
  production: false,
  api_core: {
    url: '/digipay/api',
    username: 'website-client-id',
    password: 'website-client-secret-03a4889f-0eab-4e78-b05a-a90e766599d8',
    version: '2025-01-01',
  },
  api: {
    prefix: '/api',
    host: 'https://uatsite.mydigipay.info',
    agent: '',
    version: '',
    username: '',
    password: '',
  },
  intrackRestConfig: {
    licenseCode: 'AAAAKQ',
    host: 'https://api.intrack.ir/',
    apiKey: '839bbbf7-5c0b-4452-a460-2969420723ae',
  },
  intrackConfig: {
    app_key: 'AAAAKQ',
    auth_key: 'e79aef46-1a9d-449c-a184-f5adbbab19f9',
    public_key: 'BGsjImFouv6gWBSqq8vGpz6nDg0q1KNA2G-HeLMBTF3njYDIugcV8C0c2WpB4HjFzlGi8mLaF2OuiOBXILINTT8=',
  },
  pay_prefix: '',
  // Redis configuration
  // It is being used in SSR server
  redis: {
    host: 'localhost',
    port: '6379',
  },
  ssrCacheEnabled: true,
  ssrCacheTTL: 300,
  config: {
    redirectButtonCountDownTime: 60,
  },
  appUrl: 'https://uatapp.mydigipay.info',
  mapKey: '2XfZItOluM7JHnmwX1tg',
  mapBaseUrl: 'https://tile.openstreetmap.org',
  sentry_config: {
    dsn: 'https://f0e6c738f2374d21b5693251c9af1039@crashlytics.mydigipay.com/105',
    target: ['https://devsite.mydigipay.info'],
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
    web_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
    android_hybrid_password: 'B5U4i7kzHWVcMCTitvcD',
    ios_hybrid_password: 'WtRP6H9n7pjH5QhY8YzK',
  },
  digipay_version: '2025-01-01',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
