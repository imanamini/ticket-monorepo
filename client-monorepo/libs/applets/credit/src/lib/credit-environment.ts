import { CreditEnvironmentInterface } from './features/credit/credit-environment.interface';

export function getCreditEnvironment(): CreditEnvironmentInterface {
  return {
    api_url: process.env['base_url'] || 'https://uat.mydigipay.info/digipay/api',
    name: process.env['name'] || 'local',
    creditEnv: 'dpx',
    appUrl: {
      local: 'http://localhost:4200',
      development: 'https://uatdpx.mydigipay.info',
      staging: 'https://uatapp.mydigipay.info',
      production: 'https://app.mydigipay.com',
    },
    intrack_config: {
      app_key: 'environment.intrack_config.app_key',
      auth_key: 'environment.intrack_config.auth_key',
      public_key: 'environment.intrack_config.public_key',
    },
    subscriptionUrl: 'subscription/enter',
  };
}
