import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import 'hammerjs';
import { appConfigConst, CustomPreloadingStrategy } from '@client-monorepo/app-core';
import { httpInsuranceInterceptorProviders } from '@client-monorepo/applets/insurance';
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';
import { APP_NAME } from '@client-monorepo/common/utilities';
import { CREDIT_ENVIRONMENT } from '@client-monorepo/applets/credit';
import { getCreditEnvironment } from './utils/credit-environment';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxEventTrackerModule } from '@digipay/ngx-event-tracker';
import { DigikalaService, DigikalaSuperWebService } from '@client-monorepo/pillar/digikala';

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

const initSuperWeb = (svc: DigikalaSuperWebService) => () => {
  if (svc.isDgkSuperWebUser) {
    return svc.initialize();
  }
  return Promise.resolve();
};

const addDefaultUtmSource = (digikalaService: DigikalaService) => () => {
  const platform = digikalaService.getPlatform();

  // Only add default utm_source for web users (not Android or iOS)
  if (platform === 'web') {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if utm_source is not already present
    if (!urlParams.has('utm_source')) {
      // Add default utm_source=digikala-superweb
      urlParams.set('utm_source', 'digikala-superweb');

      // Update the URL with the new query parameter using History API
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }

  return Promise.resolve();
};

const customConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withPreloading(CustomPreloadingStrategy)),
    importProvidersFrom(NgxApiConfigModule.environmentConfig(environmentConfig)),
    { provide: 'APP_ENV', useValue: environment },
    { provide: APP_NAME, useValue: 'pillar' },
    // Remove this after express deprecation
    {
      provide: CREDIT_ENVIRONMENT,
      useFactory: getCreditEnvironment,
    },
    {
      provide: 'CREDIT_BACK_HANDLER',
      useClass: BackHandlerService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initSuperWeb,
      deps: [DigikalaSuperWebService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: addDefaultUtmSource,
      deps: [DigikalaService],
      multi: true,
    },
    importProvidersFrom(
      NgxEventTrackerModule.forRoot({
        platforms: {
          gtm: {
            enabled: true,
          },
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
