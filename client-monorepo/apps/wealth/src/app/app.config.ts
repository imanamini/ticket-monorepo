import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';
import { environment } from '../environments/environment';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpRefreshInterceptor, httpWealthInterceptorProviders } from '@client-monorepo/applets/wealth';
import { PinInterceptor } from '@client-monorepo/common/pin';

const environmentConfig: EnvironmentConfig = {
  agents: {
    web_agent: environment.web_agent,
    android_agent: environment.android_agent,
    ios_agent: environment.ios_agent,
  },
  client_id: {
    web_clientId: environment.web_username,
    android_clientId: environment.android_hybrid_username,
    ios_clientId: environment.ios_hybrid_username,
  },
  client_secret: {
    web_client_secret: environment.web_password,
    android_client_secret: environment.android_hybrid_password,
    ios_client_secret: environment.ios_hybrid_password,
  },
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    httpWealthInterceptorProviders,
    { provide: 'WEALTH_ENV', useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRefreshInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PinInterceptor,
      multi: true,
    },
    importProvidersFrom(NgxApiConfigModule.environmentConfig(environmentConfig)),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    {
      provide: 'APP_CONFIG',
      useValue: environment.wealth.navigation,
    },
  ],
};
