// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NavigationConfig } from '@client-monorepo/wealth/navigation';
const baseUrl = 'localhost:4329';

export const environment = {
  env: 'local',
  app_url: 'http://localhost:4200/',
  base_url: 'https://uat.mydigipay.info/digipay/api',
  base_url_origin: 'https://uat.mydigipay.info',
  base_url_abs: 'https://uat.mydigipay.info/digipay/api',
  base_url_origin_abs: 'https://uat.mydigipay.info',
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
  intrack_config: {
    app_key: 'AAAAKQ',
    auth_key: 'e79aef46-1a9d-449c-a184-f5adbbab19f9',
    public_key: 'BGsjImFouv6gWBSqq8vGpz6nDg0q1KNA2G-HeLMBTF3njYDIugcV8C0c2WpB4HjFzlGi8mLaF2OuiOBXILINTT8=',
    android_auth_key: 'bf4bc749-e147-483c-bd0d-67e0f98f350d',
    ios_auth_key: 'b5183735-ecb0-4d64-9355-10530d3f79f3',
  },
  sentry_config: {
    dsn: 'https://89c5e07e138b757c540e194f180c6b22@crashlytics.mydigipay.com/112',
    target: ['http://localhost:4200'],
    tracesSampleRate: 1,
  },
  google_tag_manager_id: '',
  digipay_version: '2025-01-01',
  version_check_period_seconds: '180',
  wealth: {
    navigation: {
      appName: 'dpx',
      isPrefix: true,
      prefix: 'mini-app/wealth',
    } as NavigationConfig,
  },
  bnpl_1pay_purchase_url: 'https://uatweb.mydigipay.info/credit/bnpl-pay/details',
  mapKey: '2XfZItOluM7JHnmwX1tg',
  mapBaseUrl: 'https://tile.openstreetmap.org',
  appVersion: '1.0.2',
  mapIrKey:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFmYmNmYjU3NGE5NzM4ZWEwMTZhMzU1ZGE5Y2FkZjljZWVmNjFjNjA2M2I5OTVhYTUzYWUxZTc3MWNlM2NiMzljMWNmZWExOThiMmUxNTE2In0.eyJhdWQiOiIzMzM5NSIsImp0aSI6IjFmYmNmYjU3NGE5NzM4ZWEwMTZhMzU1ZGE5Y2FkZjljZWVmNjFjNjA2M2I5OTVhYTUzYWUxZTc3MWNlM2NiMzljMWNmZWExOThiMmUxNTE2IiwiaWF0IjoxNzUyNjY1OTU4LCJuYmYiOjE3NTI2NjU5NTgsImV4cCI6MTc1NTI1Nzk1OCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.RvTPqOpCtCCZhVsWleFCjVqq1pguu2ASg2Wh6KUKAb1EB8Td8rTLKnuuUWz2bdPhNke8qZbUFbphGWEaNLjj2-g1Q8989EdY8dvYvR8gLvn673oXEx5T9g8VnRVGFXtiILFZVzpuBv398fvOqTSzWm3EtMa6SEunMA-eihsn2_J4w2uPmXBFXgrfztpc9pHIixYM4jUyCmXOIR8hMYEqJiG7TpAYPSPS2fuKIBidlCGF56LoYVtaAJnb_tt0RRUmj5-CJvFV1yzzpygnMI91VG9yNZicAgbCnJcB4vSjwI2CDvn_v8Z2qJUAVRnuiQ-RVPPMxL4EVUADFJ2lg5hw1w',
  digikala: {
    super_web_tabs_sdk_url:
      'https://dkstatics-public.digikala.com/hypernova-studio-files/b1a8912beda2569ea6ccdd624313d346ced401ae_1762864531.js',
    basic_token: 'd2ViYXBwLWNsaWVudC1pZDp3ZWJhcHAtY2xpZW50LXNlY3JldC0zY2MwNTA0YS03NmM1LTQ4OGQtOGYyMC04YjIzNTEyNmM1ZDA=',
    pillar_name: 'fintech',
    api_base_url: 'https://cors.alamut.digikala.com/api/demo-api.digikala.com/super-app/v1/',
    base_url: 'https://demo.digikala.com/',
  },
  insurance: {
    name: 'local',
    production: false,
    api_username: 'webapp-client-id',
    api_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
    zone: '',
    ios_agent: 'HYBRID_IOS',
    web_agent: 'WEB',
    android_agent: 'HYBRID_ANDROID',
    web_username: 'webapp-client-id',
    web_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
    android_hybrid_username: 'hybrid-android-client-id',
    android_hybrid_password: 'B5U4i7kzHWVcMCTitvcD',
    ios_hybrid_username: 'hybrid-ios-client-id',
    ios_hybrid_password: 'WtRP6H9n7pjH5QhY8YzK',
    digipay_version: '2025-01-01',
    domain_address: 'https://' + baseUrl,
    schema_address: 'dgp://' + baseUrl,
    base_href: '/mini-app/insurance',
    api: {
      prefix: '/digipay/api',
      agent: 'WEB',
      version: '2021-11-06',
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
      android_auth_key: 'bf4bc749-e147-483c-bd0d-67e0f98f350d',
      ios_auth_key: 'b5183735-ecb0-4d64-9355-10530d3f79f3',
    },
    sentry_config: {
      dsn: 'https://d7db31e300550df4fbdf0c158f97cd81@uatsentry.mydigipay.info/116',
      target: ['localhost'],
      tracesSampleRate: 1,
    },
    version_check_period_seconds: '180',
    website_url: 'https://uatsite.mydigipay.info',
    api_url: 'https://uat.mydigipay.info',
    digikala: {
      basic_token: 'd2ViYXBwLWNsaWVudC1pZDp3ZWJhcHAtY2xpZW50LXNlY3JldC0zY2MwNTA0YS03NmM1LTQ4OGQtOGYyMC04YjIzNTEyNmM1ZDA=',
      super_web_tabs_sdk_url:
        'https://dkstatics-public.digikala.com/hypernova-studio-files/b1a8912beda2569ea6ccdd624313d346ced401ae_1762864531.js',
    },
    login_dpx_url: 'https://uatapp.mydigipay.info/auth/login',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
