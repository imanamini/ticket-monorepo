import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from "@sentry/angular-ivy";

if (environment.production) {
  enableProdMode();
}

Sentry.init({
  dsn: environment.sentryDsn,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
    new Sentry.Replay(),
  ],

  tracesSampleRate: environment.tracesSampleRate, // Capture 100% of transactions for performance monitoring

  // Log 10% of errors
  sampleRate: environment.sampleRate,

  tracePropagationTargets: environment.sentryTarget,

  // Disable capturing session replays
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});


platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => {})
  .catch(err => {
    throw new Error(err)
  });
