// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'local',
  production: false,
  version: '1.0.0',
  api: {
    prefix: '/digipay/api',
    version: '2024-03-10',
    agent: 'WEB',
  },
  merchantUrl: 'https://demo-seller.digikala.com/sellerinvoice/',
  feeCallbackUrl: 'http://localhost:4200/registration-v2/callback/fee/{CREDIT}',
  signatureCallbackUrl: 'http://localhost:4200/registration-v2/{CREDIT}/step/signature/callback',
  google_tag_manager_id: '',
  intrack_config: {
    app_key: 'AAAAKQ',
    auth_key: 'e79aef46-1a9d-449c-a184-f5adbbab19f9',
    public_key: 'BGsjImFouv6gWBSqq8vGpz6nDg0q1KNA2G-HeLMBTF3njYDIugcV8C0c2WpB4HjFzlGi8mLaF2OuiOBXILINTT8=',
    android_auth_key: 'bf4bc749-e147-483c-bd0d-67e0f98f350d',
    ios_auth_key: 'b5183735-ecb0-4d64-9355-10530d3f79f3',
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
