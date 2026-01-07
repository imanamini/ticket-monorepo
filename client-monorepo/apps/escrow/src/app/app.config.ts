import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { NgxSmartDialogModule, SmartDialogConfig } from '@digipay/ngx-smart-dialog';
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptorProviders } from '@client-monorepo/common/network';
import { HammerModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { environment } from '../environments/environment';
import { NgxEventTrackerModule } from '@digipay/ngx-event-tracker';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { APP_NAME } from '@client-monorepo/common/utilities';
import { TraceService } from '@sentry/angular-ivy';

const smartDialogConfig: SmartDialogConfig = {
  defaultWidth: 'auto',
  defaultHeight: 'auto',
  defaultMaxWidth: '500px',
  defaultMaxHeight: '600px',
  dialogBottomSheetBreakPoint: '1400px',
};
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
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    httpInterceptorProviders,
    { provide: 'APP_ENV', useValue: environment },
    { provide: APP_NAME, useValue: 'escrow' },
    importProvidersFrom(HammerModule),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(NgxSmartDialogModule.withConfig(smartDialogConfig)),
    importProvidersFrom(NgxApiConfigModule.environmentConfig(environmentConfig)),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: 'merchantRegistrationUrl', useValue: environment.merchant_registration_url },
    JalaliDatePipe,
    {
      provide: 'STATE_BOTTOM_SHEET',
      useClass: NgxBottomSheetService,
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
    {
      provide: TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [TraceService],
      multi: true,
    },
  ],
};
