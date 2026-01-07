import { NavigationConfig } from '@client-monorepo/wealth/navigation';
import { AbTestService } from '@client-monorepo/common/utilities';

const baseUrl = 'app.mydigipay.com';

export const environment = {
  env: 'production',
  app_url: 'https://app.mydigipay.com/',
  base_url: !AbTestService.drSideActive() ? 'https://api.mydigipay.com/digipay/api' : 'https://drapi.mydigipay.com/digipay/api',
  base_url_origin: !AbTestService.drSideActive() ? 'https://api.mydigipay.com' : 'https://drapi.mydigipay.com',
  base_url_abs: !AbTestService.drSideActive() ? 'https://api.mydigipay.com/digipay/api' : 'https://drapi.mydigipay.com/digipay/api',
  base_url_origin_abs: !AbTestService.drSideActive() ? 'https://api.mydigipay.com' : 'https://drapi.mydigipay.com',
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
    dsn: 'https://80b563151f13470ab9bb0d8f0d0ed3ba@crashlytics.mydigipay.com/86',
    target: ['https://app.mydigipay.com'],
    tracesSampleRate: 0.01,
  },
  google_tag_manager_id: 'GTM-PS2XTV5J',
  digipay_version: '2025-01-01',
  version_check_period_seconds: '180',
  wealth: {
    navigation: {
      appName: 'dpx',
      isPrefix: true,
      prefix: 'mini-app/wealth',
    } as NavigationConfig,
  },
  bnpl_1pay_purchase_url: 'https://web.mydigipay.com/credit/bnpl-pay/details',
  mapKey: '2XfZItOluM7JHnmwX1tg',
  mapBaseUrl: 'https://tile.openstreetmap.org',
  appVersion: '3.3.2',
  mapIrKey:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFmYmNmYjU3NGE5NzM4ZWEwMTZhMzU1ZGE5Y2FkZjljZWVmNjFjNjA2M2I5OTVhYTUzYWUxZTc3MWNlM2NiMzljMWNmZWExOThiMmUxNTE2In0.eyJhdWQiOiIzMzM5NSIsImp0aSI6IjFmYmNmYjU3NGE5NzM4ZWEwMTZhMzU1ZGE5Y2FkZjljZWVmNjFjNjA2M2I5OTVhYTUzYWUxZTc3MWNlM2NiMzljMWNmZWExOThiMmUxNTE2IiwiaWF0IjoxNzUyNjY1OTU4LCJuYmYiOjE3NTI2NjU5NTgsImV4cCI6MTc1NTI1Nzk1OCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.RvTPqOpCtCCZhVsWleFCjVqq1pguu2ASg2Wh6KUKAb1EB8Td8rTLKnuuUWz2bdPhNke8qZbUFbphGWEaNLjj2-g1Q8989EdY8dvYvR8gLvn673oXEx5T9g8VnRVGFXtiILFZVzpuBv398fvOqTSzWm3EtMa6SEunMA-eihsn2_J4w2uPmXBFXgrfztpc9pHIixYM4jUyCmXOIR8hMYEqJiG7TpAYPSPS2fuKIBidlCGF56LoYVtaAJnb_tt0RRUmj5-CJvFV1yzzpygnMI91VG9yNZicAgbCnJcB4vSjwI2CDvn_v8Z2qJUAVRnuiQ-RVPPMxL4EVUADFJ2lg5hw1w',
  cardTemplateCode: '2238',
  insurance: {
    name: 'production',
    production: true,
    api_username: 'insurance-ui-client-id',
    api_password: 'insurance-ui-client-secret-8ac85922-e170-4ffc-a475-fc10bef64927',
    zone: 'insurance',
    android_agent: 'HYBRID_ANDROID',
    ios_agent: 'HYBRID_IOS',
    web_agent: 'WEB',
    web_username: 'webapp-client-id',
    web_password: 'webapp-client-secret-debee79d-b04d-47ef-8ed5-c32e24ec836e',
    android_hybrid_username: 'hybrid-android-client-id',
    android_hybrid_password: 'hybrid-android-client-secert-ddd6c372-c3a0-4964-8faa-7b57d76f573b',
    ios_hybrid_username: 'hybrid-ios-client-id',
    ios_hybrid_password: 'hybrid-ios-client-secert-88b40c21-6c9b-42e9-8191-1d1a22664f44',
    digipay_version: '2025-01-01',
    domain_address: 'https://' + baseUrl,
    schema_address: 'dgp://' + baseUrl,
    base_href: '/',
    api: {
      prefix: '/digipay/api',
      version: '2021-11-06',
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
      android_auth_key: 'f8efcf8d-3a73-4987-8075-8894d09b87b9',
      ios_auth_key: '511ac095-f4a8-443f-8552-0e9553309261',
    },
    sentry_config: {
      dsn: 'https://6ca039e2966a47a9ab0c06261c836b38@crashlytics.mydigipay.com/95',
      target: ['localhost'],
      tracesSampleRate: 0.01,
    },
    version_check_period_seconds: '180',
    website_url: 'https://www.mydigipay.com',
    api_url: 'https://api.mydigipay.com',
    digikala: {
      basic_token: 'ZGlnaWthbGEtc3VwcGVyYXBwLWNsaWVudC1pZDpUITd2S20jMnpSZkA5WGVM',
      super_web_tabs_sdk_url: 'https://www.digikala.com/dk-superweb-tabs-sdk.umd.min.js',
    },
    login_dpx_url: 'https://app.mydigipay.com/auth/login',
  },
};
