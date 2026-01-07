// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'development',
  production: false,
  api_url: 'https://uat.mydigipay.info/digipay/api/',
  digipay_version: '2025-01-01',

  web_agent: 'WEB',
  android_agent: 'HYBRID_ANDROID',
  ios_agent: 'HYBRID_IOS',
  web_username: 'webapp-client-id',
  web_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
  android_hybrid_username: 'hybrid-android-client-id',
  android_hybrid_password: 'B5U4i7kzHWVcMCTitvcD',
  ios_hybrid_username: 'hybrid-ios-client-id',
  ios_hybrid_password: 'WtRP6H9n7pjH5QhY8YzK',

  google_tag_manager_id: [''],
  credit: {
    fail_url: 'https://www.digikala.com/',
    app_download_link: 'https://app.adjust.com/91s4vas_3vm4qxv?fallback=https://mydigipay.com/download.html'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
