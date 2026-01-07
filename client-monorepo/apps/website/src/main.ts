import { environment } from './environments/environment';
import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationRef, enableProdMode } from '@angular/core';
import { browserProfilingIntegration, browserTracingIntegration, init } from '@sentry/angular-ivy';

if (environment.production) {
  enableProdMode();
}

init({
  dsn: environment.sentry_config.dsn,
  tracesSampleRate: environment.sentry_config.tracesSampleRate,
  tracePropagationTargets: environment.sentry_config.target,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
  environment: environment.name,
  integrations: [browserTracingIntegration(), browserProfilingIntegration()],
  denyUrls: [
    /https?:\/\/((cdn|www)\.)?api.mediaad\.org/,
    /https?:\/\/google-analytics\.com/,
    /https?:\/\/((cdn|www)\.)?r.clarity\.ms/,
    /https?:\/\/api\.mydigipay\.com/,
  ],
});


bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {
    const applicationRef = ref.injector.get(ApplicationRef);
    const appComponent = applicationRef.components[0];
    if (environment.name !== 'production') {
      enableDebugTools(appComponent);
    }
  })
  .catch((err) => console.error(err));
