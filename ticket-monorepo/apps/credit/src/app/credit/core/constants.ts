import { environment } from '../../../environments/environment';
import { EnvironmentConfig } from '@digipay/ngx-api-config';

export const environmentConfig: EnvironmentConfig = {
  agents: {
    web_agent: environment.web_agent,
    android_agent: environment.android_agent,
    ios_agent: environment.ios_agent,
  },
  client_id: {
    web_clientId: environment.web_username,
    android_clientId: environment.android_hybrid_username,
    ios_clientId: environment.ios_hybrid_username
  },
  client_secret: {
    web_client_secret: environment.web_password,
    android_client_secret: environment.android_hybrid_password,
    ios_client_secret: environment.ios_hybrid_password
  },
  digipayVersion: environment.digipay_version,
};
