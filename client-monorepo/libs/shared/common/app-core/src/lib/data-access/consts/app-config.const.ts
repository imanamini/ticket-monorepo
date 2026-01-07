import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import {
  checkCampaignMode,
  checkDisasterLevel,
  CustomErrorHandlerService,
  performanceTierInitializer,
  ServiceWorkerHandlerService,
} from '@client-monorepo/app-core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { httpInterceptorProviders } from '@client-monorepo/common/network';
import { httpWealthInterceptorProviders } from '@client-monorepo/applets/wealth';
import { HammerModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { TraceService } from '@sentry/angular-ivy';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CREDIT_ENVIRONMENT, getCreditEnvironment } from '@client-monorepo/applets/credit';
import { DisasterLevelService, PerformanceTierService } from '@client-monorepo/common/utilities';
import { CampaignService } from '@client-monorepo/campaign';

export function initializeServiceWorkerHandler(swHandler: ServiceWorkerHandlerService) {
  return () => swHandler.init();
}

export const appConfigConst: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandlerService },
    provideHttpClient(withInterceptorsFromDi()),
    httpInterceptorProviders,
    httpWealthInterceptorProviders,
    importProvidersFrom(HammerModule),
    importProvidersFrom(MatDialogModule),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeServiceWorkerHandler,
      multi: true,
      deps: [ServiceWorkerHandlerService],
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:5000',
    }),
    JalaliDatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: performanceTierInitializer,
      multi: true,
      deps: [PerformanceTierService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: checkDisasterLevel,
      multi: true,
      deps: [DisasterLevelService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: checkCampaignMode,
      multi: true,
      deps: [CampaignService],
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
    {
      provide: 'STATE_BOTTOM_SHEET',
      useClass: NgxBottomSheetService,
    },
    {
      provide: CREDIT_ENVIRONMENT,
      useFactory: getCreditEnvironment,
    },
  ],
};
