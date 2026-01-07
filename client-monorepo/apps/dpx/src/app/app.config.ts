import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import 'hammerjs';
import { NgxEventTrackerModule } from '@digipay/ngx-event-tracker';
import { appConfigConst, CustomPreloadingStrategy } from '@client-monorepo/app-core';
import { httpInsuranceInterceptorProviders } from '@client-monorepo/applets/insurance';
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';
import { APP_NAME } from '@client-monorepo/common/utilities';
import { BackHandlerService } from '@client-monorepo/back-handler';

const environmentConfig: EnvironmentConfig = {
  agents: {
    web_agent: environment.agents.web_agent,
    android_agent: environment.agents.android_agent,
    ios_agent: environment.agents.ios_agent,
  },
  client_id: {
    web_clientId: environment.client_ids.web_username,
    android_clientId: environment.client_ids.android_hybrid_username,
    ios_clientId: environment.client_ids.ios_hybrid_username,
  },
  client_secret: {
    web_client_secret: environment.client_secrets.web_password,
    android_client_secret: environment.client_secrets.android_hybrid_password,
    ios_client_secret: environment.client_secrets.ios_hybrid_password,
  },
  digipayVersion: environment.digipay_version,
};

const customConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withPreloading(CustomPreloadingStrategy)),
    importProvidersFrom(NgxApiConfigModule.environmentConfig(environmentConfig)),
    { provide: 'APP_ENV', useValue: environment },
    { provide: APP_NAME, useValue: 'dpx' },
    { provide: 'CREDIT_BACK_HANDLER', useClass: BackHandlerService },
    importProvidersFrom(
      NgxEventTrackerModule.forRoot({
        platforms: {
          gtm: {
            enabled: true,
          },
          // if you want set true, MUST BE deleted window.Intk = window.Intk || function () {}; from index.html
          intrack: {
            enabled: false,
          },
        },
        environment: {
          gtm_id: environment.google_tag_manager_id,
          intrack_config: environment.intrack_config,
          env: environment.env, // 'production', 'staging', etc.
        },
      }),
    ),
  ],
};

export const appConfig: ApplicationConfig = {
  providers: [...appConfigConst.providers, httpInsuranceInterceptorProviders, ...customConfig.providers],
};
