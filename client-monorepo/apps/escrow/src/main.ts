import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from '../../dpx/src/environments/environment';
import {
  browserProfilingIntegration,
  browserTracingIntegration,
  captureConsoleIntegration,
  init
} from '@sentry/angular-ivy';
import { ApplicationRef } from '@angular/core';

if (environment.env === 'production') {
  init({
    dsn: environment.sentry_config.dsn,
    tracesSampleRate: environment.sentry_config.tracesSampleRate,
    tracePropagationTargets: environment.sentry_config.target,
    debug: false,
    environment: environment.env,
    integrations: [browserTracingIntegration(), browserProfilingIntegration(), captureConsoleIntegration({ levels: ['warn', 'error'] })],
    denyUrls: [
      /https?:\/\/((cdn|www)\.)?api.mediaad\.org/,
      /https?:\/\/google-analytics\.com/,
      /https?:\/\/((cdn|www)\.)?r.clarity\.ms/,
      /\/serve\/\d+\/retargeting\.js$/,
    ],
    release: environment.appVersion,
    // Dynamic filtering for fetch/load errors to those domains
    beforeSend(event, hint) {
      // ===== Non-Standard Error Filtering (false/undefined/WebView lifecycle) =====
      const originalException = hint?.originalException;
      const errorMessage = event.message || event.exception?.values?.[0]?.value || '';

      // Filter out false/undefined errors from external sources (Digikala SuperApp, etc.)
      if (originalException === false || originalException === undefined) {
        return null; // Don't send to Sentry
      }

      // Filter out WebView lifecycle errors (Android Java bridge issues)
      if (errorMessage.includes('Java object is gone') || (errorMessage.includes('postMessage') && errorMessage.includes('Java'))) {
        return null; // Don't send to Sentry
      }

      // Filter out NonStandardError with boolean/undefined types
      if (
        event.exception?.values?.some(
          (ex) =>
            ex.type === 'NonStandardError' &&
            (ex.value?.includes('boolean - false') ||
              ex.value?.includes('undefined - undefined') ||
              ex.value?.includes('"isTrusted": true')), // Browser events
        )
      ) {
        return null; // Don't send to Sentry
      }

      // Filter out browser Event objects (isTrusted events)
      if (
        originalException &&
        typeof originalException === 'object' &&
        'isTrusted' in originalException &&
        originalException.isTrusted === true
      ) {
        return null; // Don't send to Sentry - these are browser events
      }

      // ===== HTTP Status 0 Exception (Allow these through) =====
      // Check if this is an intentionally logged HTTP status 0 error (from CustomErrorHandler)
      const isHttpStatus0Error = event.tags?.error_category === 'http_timeout' ||
                                 event.tags?.http_status === '0' ||
                                 event.exception?.values?.some(ex => ex.type === 'HttpTimeoutError');

      if (isHttpStatus0Error) {
        // Allow HTTP status 0 errors through - we want to track these
        return event;
      }

      // ===== Timeout and Network Error Filtering =====
      const TIMEOUT_NETWORK_PATTERNS = [
        /timeout/i, // Generic timeout errors
        /timed out/i, // Timeout messages
        /network error/i, // Network errors
        /networkerror/i, // NetworkError
        /err_internet_disconnected/i, // Chrome offline error
        /err_connection/i, // Connection errors
        /cache.*version.*mismatch/i, // Cache version issues
        /cacheversion/i, // CacheVersion logs
        /service worker.*timeout/i, // Service worker timeouts
        /loading chunk.*failed/i, // Chunk loading failures (often network related)
        /err_name_not_resolved/i, // DNS resolution failures
        /err_connection_refused/i, // Connection refused
        /err_connection_reset/i, // Connection reset
        /err_network_changed/i, // Network changed
        /load failed/i, // Generic load failures
        /failed to fetch dynamically imported module/i,
      ];

      const isTimeoutOrNetworkError = (text) => text && TIMEOUT_NETWORK_PATTERNS.some((p) => p.test(text));

      // Check error message
      if (isTimeoutOrNetworkError(hint?.originalException?.toString() || event.message)) {
        return null;
      }

      // Check exception values
      if (event.exception?.values?.some((ex) => isTimeoutOrNetworkError(ex.type) || isTimeoutOrNetworkError(ex.value))) {
        return null;
      }

      // Check breadcrumbs for network/timeout issues
      if (event.breadcrumbs?.some((b) => isTimeoutOrNetworkError(b.message) || isTimeoutOrNetworkError(b.category))) {
        return null;
      }

      // ===== Third-party ignore patterns (existing logic) =====
      const THIRD_PARTY_IGNORE_PATTERNS = [
        /clarity/i, // Clarity (all forms)
        /mediaad\.org/i, // MediaAd
        /google-analytics/i, // Google Analytics
        /retargeting\.js|\/serve\/\d+\//i, // Retargeting scripts
      ];

      const shouldIgnore = (text) => text && THIRD_PARTY_IGNORE_PATTERNS.some((p) => p.test(text));

      // Check stack frames
      if (event.exception?.values?.some((ex) => ex.stacktrace?.frames?.every((f) => shouldIgnore(f.filename)))) {
        return null;
      }

      // Check breadcrumbs
      if (event.breadcrumbs?.some((b) => (b.category === 'fetch' || b.category === 'xhr') && shouldIgnore(b.message))) {
        return null;
      }

      // Check error message
      if (shouldIgnore(hint?.originalException?.toString() || event.message)) {
        return null;
      }

      // ===== API Error Filtering Logic =====
      // Define DigiPay API patterns
      const DIGIPAY_API_PATTERNS = [
        /api\.mydigipay\.com\/digipay\/api\//, // Production
        /uat\.mydigipay\.info\/digipay\/api\//, // Staging
      ];
      const error = hint?.originalException;

      // Check if this is an HTTP error
      if (error && typeof error === 'object' && 'status' in error) {
        const httpError = error as any;
        const httpStatus = httpError.status;

        // Get the URL from various possible locations
        const url = httpError.url || httpError.config?.url || event.request?.url || event.contexts?.trace?.data?.url;

        // Check if this is from your DigiPay API (production or staging)
        const isDigiPayAPI = url && typeof url === 'string' && DIGIPAY_API_PATTERNS.some((pattern) => pattern.test(url));

        if (isDigiPayAPI) {
          // Get response data
          const responseData = httpError.error || httpError.response?.data || httpError.body;

          // RULE 1: Allow all 5xx errors
          if (httpStatus >= 500 && httpStatus < 600) {
            // Add context for better debugging
            if (event.contexts) {
              event.contexts.apiError = {
                httpStatus: httpStatus,
                apiStatus: responseData?.status,
                title: responseData?.title,
                message: responseData?.message,
                level: responseData?.level,
              };
            }
            return event; // Send to Sentry
          }

          // RULE 2: Allow 4xx errors ONLY if response status is 1000
          if (httpStatus >= 400 && httpStatus < 500) {
            if (responseData && responseData.status === 1000) {
              // Add context for better debugging
              if (event.contexts) {
                event.contexts.apiError = {
                  httpStatus: httpStatus,
                  apiStatus: responseData.status,
                  title: responseData.title,
                  message: responseData.message,
                  level: responseData.level,
                };
              }
              return event; // Send to Sentry
            }
            // Ignore other 4xx errors
            return null;
          }

          // RULE 3: Ignore all other API errors
          return null;
        }
      }

      // Allow all other errors (non-API JavaScript errors, etc.)
      return event;
    },
  });
}

bootstrapApplication(AppComponent, appConfig)
  .then((ref) => {
    const applicationRef = ref.injector.get(ApplicationRef);
    const appComponent = applicationRef.components[0];
    if (environment.env !== 'production') {
      enableDebugTools(appComponent);
    }
  })
  .catch((err) => console.error(err));
