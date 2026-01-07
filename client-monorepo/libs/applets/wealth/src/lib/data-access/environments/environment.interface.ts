import { NavigationConfig } from '@client-monorepo/wealth/navigation';
import { IntrackConfig } from '@digipay/ngx-event-tracker';

export interface IEnvironment {
  env?: string;
  production: boolean;
  baseApiUrl: string;
  sentry_dsn: string;
  service_worker: boolean;
  android_agent: string;
  ios_agent: string;
  web_agent: string;
  web_username: string;
  web_password: string;
  android_hybrid_username: string;
  android_hybrid_password: string;
  ios_hybrid_username: string;
  ios_hybrid_password: string;
  callbackUrl: string;
  stagingCallbackUrl?: string;
  clientMetadata: string;
  supperAppLoginUrl: string;
  afterLoginUrl: string;
  isWealthDomain: boolean;
  intrackConfig: IntrackConfig;
  wealth: {
    navigation: NavigationConfig;
  };
  google_tag_manager_id: string;
}
