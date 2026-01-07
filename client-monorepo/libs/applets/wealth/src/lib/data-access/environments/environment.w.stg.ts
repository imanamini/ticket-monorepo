import { IEnvironment } from './environment.interface';
import { NavigationConfig } from '@client-monorepo/wealth/navigation';

export const environment: IEnvironment = {
  production: true,
  callbackUrl: 'https://wealth.mydigipay.info/ipg-callback',
  supperAppLoginUrl: '',
  afterLoginUrl: '',
  clientMetadata: 'https://wealth.mydigipay.info/ipg-callback',
  isWealthDomain: true,
  baseApiUrl: '/api/',
  sentry_dsn:
    'https://91df8476600b5e099a9a087cb306573a@uatsentry.mydigipay.info/115',
  android_agent: 'HYBRID_ANDROID',
  ios_agent: 'HYBRID_IOS',
  web_agent: 'WEB',
  service_worker: true,
  web_username: 'webapp-client-id',
  web_password: 'webapp-client-secret-3cc0504a-76c5-488d-8f20-8b235126c5d0',
  android_hybrid_username: 'hybrid-android-client-id',
  android_hybrid_password: 'B5U4i7kzHWVcMCTitvcD',
  ios_hybrid_username: 'hybrid-ios-client-id',
  ios_hybrid_password: 'WtRP6H9n7pjH5QhY8YzK',
  google_tag_manager_id: '',
  intrackConfig: {
    app_key: 'AAAAKQ',
    auth_key: 'e79aef46-1a9d-449c-a184-f5adbbab19f9',
    public_key:
      'BGsjImFouv6gWBSqq8vGpz6nDg0q1KNA2G-HeLMBTF3njYDIugcV8C0c2WpB4HjFzlGi8mLaF2OuiOBXILINTT8=',
    android_auth_key: 'bf4bc749-e147-483c-bd0d-67e0f98f350d',
    ios_auth_key: 'b5183735-ecb0-4d64-9355-10530d3f79f3',
  },
  wealth: {
    navigation: {
      appName: 'wealth',
      isPrefix: false,
      prefix: '',
    } as NavigationConfig,
  },
};
