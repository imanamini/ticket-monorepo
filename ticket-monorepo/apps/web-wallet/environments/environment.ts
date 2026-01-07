// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'development',
  production: false,
  api_prefix: '/digipay/api',
  api_username: 'webapp-client-id',
  api_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
  digipay_version: '2019-07-17',
  google_tag_manager_id: '',
  google_analytics_tracking_id: 'UA-151185661-1',
  fail_url: 'https://www.digikala.com/',
  // in dev, app is running on the / and there is no need for prefix
  // prefix should not have trailing slash
  route_prefix: '',
  app_base_url: 'http://localhost:4200',
  sentryDsn:'https://3fb51afd7bd9b79cf090342aa78878e9@uatsentry.mydigipay.info/96',
  sentryTarget:['http://localhost:52424/tgs/'],
  tracesSampleRate:1.0,
  sampleRate:0.1,

  android_agent: 'HYBRID_ANDROID',
  ios_agent: 'HYBRID_IOS',
  web_agent: 'WEB',
  web_username: 'webapp-client-id',
  web_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
  android_hybrid_username: 'hybrid-android-client-id',
  android_hybrid_password: 'B5U4i7kzHWVcMCTitvcD',
  ios_hybrid_username: 'hybrid-ios-client-id',
  ios_hybrid_password: 'WtRP6H9n7pjH5QhY8YzK',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
