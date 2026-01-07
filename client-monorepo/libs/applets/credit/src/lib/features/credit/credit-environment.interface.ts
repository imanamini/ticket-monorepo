import { InjectionToken } from '@angular/core';

export interface CreditEnvironmentInterface {
  api_url: string;
  name: string;
  creditEnv: string;
  appUrl?: CreditEnvironmentApiUrlInterface;
  intrack_config: {
    app_key: string;
    auth_key: string;
    public_key: string;
  };
  subscriptionUrl?: string;
}

export interface CreditEnvironmentApiUrlInterface {
  local: string;
  development: string;
  staging: string;
  production: string;
}

const CreditEnvironmentInterface: CreditEnvironmentInterface = {
  api_url: '',
  creditEnv: '',
  intrack_config: { app_key: '', auth_key: '', public_key: '' },
  name: '',
};

export const CREDIT_ENVIRONMENT = new InjectionToken<CreditEnvironmentInterface>('creditEnvironmentOptions', {
  providedIn: 'root',
  factory: () => CreditEnvironmentInterface,
});
