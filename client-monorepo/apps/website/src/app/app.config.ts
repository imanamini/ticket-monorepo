import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Router, UrlSerializer, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CoreModule } from './core/core.module';
import { NgxSmartDialogModule, SmartDialogConfig } from '@digipay/ngx-smart-dialog';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptor } from './core/http/app.interceptor';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SsrDeviceDetectorService } from './core/services/device/ssr-device-detector.service';
import { environment } from '../environments/environment';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TraceService } from '@sentry/angular-ivy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomUrlSerializer } from './core/CustomUrlSerializer';
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';

const smartDialogConfig: SmartDialogConfig = {
  defaultWidth: '400px',
  defaultHeight: 'auto',
  defaultMaxWidth: 'auto',
  defaultMaxHeight: 'auto',
  dialogBottomSheetBreakPoint: '744px',
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
    importProvidersFrom(
      BrowserModule,
      MatDialogModule,
      CoreModule,
      NgxSmartDialogModule.withConfig(smartDialogConfig),
      BrowserAnimationsModule,
    ),
    importProvidersFrom(NgxApiConfigModule.environmentConfig(environmentConfig)),
    provideRouter(routes, withEnabledBlockingInitialNavigation(), withInMemoryScrolling()),

    { provide: UrlSerializer, useClass: CustomUrlSerializer },

    { provide: 'APP_ENV', useValue: environment },
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: DeviceDetectorService,
      useClass: SsrDeviceDetectorService,
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
    {
      provide: MAT_BOTTOM_SHEET_DATA,
      useValue: {},
    },
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
