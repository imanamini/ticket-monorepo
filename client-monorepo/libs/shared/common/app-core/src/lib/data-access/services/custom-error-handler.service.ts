import { ErrorHandler, inject, Injectable } from '@angular/core';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { AppNameService } from '@client-monorepo/common/utilities';
import * as Sentry from '@sentry/angular-ivy';

@Injectable()
export class CustomErrorHandlerService implements ErrorHandler {
  private eventManagementService = inject(EventManagementService);
  private appNameService = inject(AppNameService);
  private isHandlingError = false; // Guard against infinite loops

  handleError(error: any): void {
    // Prevent infinite loop if error handler itself throws an error
    if (this.isHandlingError) {
      console.error('⚠️ Error handler recursion detected, preventing infinite loop:', error);
      return;
    }

    try {
      this.isHandlingError = true;
      this.handleErrorSafely(error);
    } catch (handlerError) {
      // If error handler itself fails, log to console only
      console.error('❌ Error handler failed:', handlerError);
      console.error('Original error:', error);
    } finally {
      this.isHandlingError = false;
    }
  }

  private serializeError(error: any): string {
    try {
      if (error === null) return 'null';
      if (error === undefined) return 'undefined';
      if (typeof error === 'string') return error;
      if (typeof error === 'number' || typeof error === 'boolean') return String(error);

      // For objects, try to extract meaningful info
      if (typeof error === 'object') {
        // If it has a message property, prioritize that
        if (error.message) return error.message;

        // Try to stringify the object
        try {
          const stringified = JSON.stringify(error, null, 2);
          // Truncate if too long
          return stringified.length > 500 ? stringified.substring(0, 500) + '...' : stringified;
        } catch {
          // If JSON.stringify fails (circular reference), fallback
          return `[${error.constructor?.name || 'Object'}]`;
        }
      }

      return String(error);
    } catch {
      return '[Unable to serialize error]';
    }
  }

  private handleErrorSafely(error: any): void {
    // Gather detailed information first
    const errorType = typeof error;
    const errorConstructor = error?.constructor?.name || 'Unknown';
    const errorMessage = error?.message || this.serializeError(error);
    const stack = error?.stack || new Error().stack;

    // ===== Ignore 401/400/422 HTTP errors =====
    // 401/400: Handled by the HTTP interceptor (token refresh logic)
    // 422: Unprocessable Entity - business logic validation errors
    // No need to log them here as they're part of normal flow
    if (error?.status === 401 || error?.status === 400 || error?.status === 422) {
      return; // Silently ignore - interceptor will handle it
    }

    // ===== Handle Chunk Loading Errors (MUST BE BEFORE SUPPRESSION) =====
    // These happen when:
    // 1. New deployment and old chunks are no longer available
    // 2. Service Worker serving stale content
    // 3. Network issues during lazy loading
    const message = errorMessage || '';
    const isChunkLoadingError =
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Importing a module script failed') ||
      message.includes('A ServiceWorker intercepted') ||
      (message.includes('Loading chunk') && message.includes('failed'));

    if (isChunkLoadingError) {
      console.error('🔄 Dynamic import error detected, clearing cache and refreshing page...');

      // ===== Prevent Infinite Refresh Loop =====
      const REFRESH_COUNTER_KEY = 'chunk_error_refresh_count';
      const REFRESH_TIMESTAMP_KEY = 'chunk_error_refresh_timestamp';
      const MAX_REFRESH_ATTEMPTS = 3;
      const COOLDOWN_PERIOD = 60000; // 1 minute cooldown

      try {
        const now = Date.now();
        const lastRefreshTime = parseInt(sessionStorage.getItem(REFRESH_TIMESTAMP_KEY) || '0', 10);
        const timeSinceLastRefresh = now - lastRefreshTime;

        // Reset counter if cooldown period has passed
        if (timeSinceLastRefresh > COOLDOWN_PERIOD) {
          sessionStorage.setItem(REFRESH_COUNTER_KEY, '0');
        }

        const refreshCount = parseInt(sessionStorage.getItem(REFRESH_COUNTER_KEY) || '0', 10);

        if (refreshCount >= MAX_REFRESH_ATTEMPTS) {
          console.error(
            `⚠️ Refresh loop detected! Attempted ${refreshCount} times. Aborting auto-refresh.`,
          );
          Sentry.captureMessage('Chunk loading error refresh loop detected', {
            level: 'error',
            tags: {
              action: 'refresh_loop_prevented',
              refresh_count: refreshCount,
              pathname: window.location.pathname,
            },
          });

          // Clear counters and don't refresh - break the loop
          sessionStorage.removeItem(REFRESH_COUNTER_KEY);
          sessionStorage.removeItem(REFRESH_TIMESTAMP_KEY);
          return;
        }

        // Increment counter and update timestamp
        sessionStorage.setItem(REFRESH_COUNTER_KEY, String(refreshCount + 1));
        sessionStorage.setItem(REFRESH_TIMESTAMP_KEY, String(now));
      } catch (storageError) {
        console.warn('Could not access sessionStorage:', storageError);
      }

      // Clear all caches
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }

      // Add timestamp to URL to force reload
      // const urlObj = new URL(window.location.href);
      // const pageUrl = urlObj.pathname;
      // Sentry.captureMessage(`User reloaded from ${pageUrl} because chunk loading failed`, {
      //   level: 'info',
      //   tags: {
      //     action: 'chunk_load_failed_reload',
      //     pathname: pageUrl,
      //   },
      // });

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);

      return; // Don't process further - we're reloading
    }

    // Handle HTTP timeout/network errors (status 0) - log to Sentry with special tags
    // Pattern 1: Direct HttpErrorResponse
    if (error?.status === 0 && error?.url) {
      // Set tags for filtering in Sentry
      // Sentry.setTag('error_type', errorType);
      // Sentry.setTag('error_constructor', errorConstructor);
      // Sentry.setTag('error_category', 'http_timeout');
      // Sentry.setTag('http_status', '0');
      // Sentry.setTag('failed_url', error.url);
      //
      // const timeoutError = new Error(`HTTP Timeout/Network Error: ${error.url}`);
      // timeoutError.stack = stack;
      // timeoutError.name = 'HttpTimeoutError';
      //
      // Sentry.captureException(timeoutError, {
      //   level: 'error',
      //   fingerprint: ['http-timeout', error.url],
      //   contexts: {
      //     http: {
      //       url: error.url,
      //       status: 0,
      //       statusText: error.statusText || 'Unknown Error',
      //     }
      //   }
      // });

      // Detailed console log for local debugging
      console.error(
        `🔴 HTTP Timeout/Network Error caught by CustomErrorHandler:\n` +
          `Type: ${errorType}\n` +
          `Constructor: ${errorConstructor}\n` +
          `URL: ${error.url}\n` +
          `Status: 0 (Timeout/Network Error)\n` +
          `StatusText: ${error.statusText || 'Unknown Error'}\n` +
          `Page URL: ${window.location.href}\n` +
          `Stack: ${stack?.substring(0, 1000)}`,
        '\n📋 Raw error object:',
        error,
      );
      return;
    }
    // Pattern 2: Error message contains "Http failure response" and "0 Unknown Error"
    if (errorMessage.includes('Http failure response') && errorMessage.includes(': 0 Unknown Error')) {
      // Extract URL from error message
      const urlMatch = errorMessage.match(/Http failure response for ([^:]+):/);
      const url = urlMatch ? urlMatch[1] : 'unknown';
      //
      // // Set tags for filtering in Sentry
      // Sentry.setTag('error_type', errorType);
      // Sentry.setTag('error_constructor', errorConstructor);
      // Sentry.setTag('error_category', 'http_timeout');
      // Sentry.setTag('http_status', '0');
      // Sentry.setTag('failed_url', url);
      //
      // const timeoutError = new Error(`HTTP Timeout/Network Error: ${url}`);
      // timeoutError.stack = stack;
      // timeoutError.name = 'HttpTimeoutError';
      //
      // Sentry.captureException(timeoutError, {
      //   level: 'error',
      //   fingerprint: ['http-timeout', url],
      //   contexts: {
      //     http: {
      //       url: url,
      //       status: 0,
      //       statusText: 'Unknown Error',
      //     }
      //   }
      // });

      // Detailed console log for local debugging
      console.error(
        `🔴 HTTP Timeout/Network Error caught by CustomErrorHandler:\n` +
          `Type: ${errorType}\n` +
          `Constructor: ${errorConstructor}\n` +
          `URL: ${url}\n` +
          `Status: 0 (Timeout/Network Error)\n` +
          `StatusText: Unknown Error\n` +
          `Page URL: ${window.location.href}\n` +
          `Message: ${errorMessage}\n` +
          `Stack: ${stack?.substring(0, 1000)}`,
        '\n📋 Raw error object:',
        error,
      );
      return;
    }
    const isSuspiciousError =
      error === false || error === null || error === undefined || typeof error === 'boolean' || typeof error === 'number';
    const isAssertionError = errorMessage.includes('ASSERTION ERROR') || errorMessage.includes('Must never be called in production mode');

    // Suppress known non-critical false/undefined errors from external sources
    // These are caused by external JavaScript (Digikala SuperApp, browser extensions, Tag Manager, etc.)
    // returning false/undefined instead of proper Error objects
    // We've added defensive code in our services, but can't control external JS
    if (isSuspiciousError && !isAssertionError) {
      if (error === false || error === undefined) {
        // Check if this error is from internal code (our app chunks) or external scripts
        const isFromInternalCode =
          stack &&
          (stack.includes('mydigipay.com/chunk-') ||
            stack.includes('mydigipay.com/main.') ||
            stack.includes('mydigipay.info/chunk-') ||
            stack.includes('mydigipay.info/main.'));

        if (isFromInternalCode) {
          // SUPPRESSED: These are usually RxJS/Promise issues that are not actionable
          // They create too much noise in Sentry without providing value
          // Keep console log for local debugging only
          console.warn(
            `⚠️ [SUPPRESSED] Internal ${errorType.charAt(0).toUpperCase() + errorType.slice(1)} Error:\n` +
              `Type: ${errorType}\n` +
              `Constructor: ${errorConstructor}\n` +
              `Page URL: ${window.location.href}\n` +
              `Stack: ${stack?.substring(0, 1000)}`,
            '\n📋 Raw error value:',
            error,
          );
        } else {
          // This is from external scripts - suppress it
          const serializedValue = this.serializeError(error);
          console.warn(
            `⚠️ [SUPPRESSED] Non-standard error from external source: ${errorType} = ${serializedValue}\nURL: ${window.location.href}\nStack: ${stack?.substring(0, 500)}`,
          );
        }
        return;
      }
    }

    // Suppress errors from external scripts (Tag Manager, CSP-blocked scripts, etc.)
    // These come as objects with rawValue/serializedValue of false/undefined
    if (error && typeof error === 'object' && !isAssertionError) {
      const rawValue = (error as any).rawValue;
      const serializedValue = (error as any).serializedValue;

      // Only suppress if these properties EXIST on the error object AND have false/undefined/null values
      // Don't suppress normal errors that just don't have these properties
      const hasRawValue = 'rawValue' in error;
      const hasSerializedValue = 'serializedValue' in error;

      if (
        (hasRawValue && (rawValue === false || rawValue === undefined || rawValue === null)) ||
        (hasSerializedValue && (serializedValue === false || serializedValue === undefined || serializedValue === null))
      ) {
        console.warn(`⚠️ [SUPPRESSED] Non-standard error from external source:`, error, '\nURL:', window.location.href);
        return; // Don't send to Sentry - these are external script errors we can't fix
      }
    }

    // TODO: TEMPORARILY DISABLED - Testing if scanner error handlers work
    // Re-enable this suppression after verifying fixes in Sentry
    // Suppress camera/media device errors - these are user environment issues
    // Common patterns:
    // - "NotReadableError: Could not start video source"
    // - "NotAllowedError: Permission denied"
    // - "Camera is in use by another app"
    // if (errorMessage.includes('NotReadableError') ||
    //     errorMessage.includes('Could not start video source') ||
    //     errorMessage.includes('Camera is in use') ||
    //     errorMessage.includes('NotAllowedError') ||
    //     errorMessage.includes('@zxing/ngx-scanner')) {
    //   console.warn(
    //     `⚠️ [SUPPRESSED] Camera/media device error: ${errorMessage}`,
    //     '\nURL:', window.location.href,
    //     '\nStack:', stack?.substring(0, 500)
    //   );
    //   return; // Don't send to Sentry - these are user environment issues
    // }

    // TODO: TEMPORARILY DISABLED - Testing if DeviceInfoService and MarketInterceptor fixes work
    // Re-enable this suppression after verifying fixes in Sentry
    // Suppress WebView lifecycle errors (Android Java bridge issues)
    // These happen when WebView is being destroyed while JS is still executing
    // Common patterns:
    // - "Java object is gone"
    // - "Error invoking postMessage"
    // - "Error invoking getDeviceInfo: Java bridge method invocation error"
    // - "Error invoking getMarketName: Java bridge method invocation error"
    // - Any "Error invoking [method]: Java bridge" errors
    // if (errorMessage.includes('Java object is gone') ||
    //     errorMessage.includes('Java bridge method invocation error') ||
    //     (errorMessage.includes('Error invoking') && errorMessage.includes('Java')) ||
    //     (errorMessage.includes('postMessage') && errorMessage.includes('Java'))) {
    //   console.warn(
    //     `⚠️ [SUPPRESSED] WebView lifecycle error: ${errorMessage}`,
    //     '\nURL:', window.location.href,
    //     '\nStack:', stack?.substring(0, 500)
    //   );
    //   return; // Don't send to Sentry - this is a timing issue we can't control
    // }

    // Set tags for filtering in Sentry
    Sentry.setTag('error_type', errorType);
    Sentry.setTag('error_constructor', errorConstructor);
    if (isSuspiciousError) {
      Sentry.setTag('suspicious_error', 'true');
    }
    if (isAssertionError) {
      Sentry.setTag('assertion_error', 'true');
    }

    // Capture the error
    if (error instanceof Error) {
      // Standard Error object
      const captureOptions: any = { level: 'error' };

      // Add special fingerprint for ASSERTION ERRORs to group them in Sentry
      if (isAssertionError) {
        captureOptions.fingerprint = ['assertion-error', errorMessage];
      }

      Sentry.captureException(error, captureOptions);
    } else {
      // Non-standard error (like false, null, number, objects without Error constructor, etc.)
      const serializedError = this.serializeError(error);
      const syntheticError = new Error(`Non-standard error: ${errorType} - ${serializedError}`);
      syntheticError.stack = stack;
      syntheticError.name = 'NonStandardError';

      Sentry.captureException(syntheticError, {
        level: 'error',
        fingerprint: ['non-standard-error', errorType, serializedError.substring(0, 100)],
      });
    }

    // Single consolidated console log for local debugging
    const serializedValue = this.serializeError(error);
    console.error(
      `🔴 Error caught by CustomErrorHandler:\n` +
        `Type: ${errorType}\n` +
        `Constructor: ${errorConstructor}\n` +
        `Message: ${errorMessage}\n` +
        `Serialized: ${serializedValue}\n` +
        `URL: ${window.location.href}\n` +
        `Stack: ${stack?.substring(0, 1000)}` +
        (isSuspiciousError ? '\n⚠️ Suspicious: true' : '') +
        (isAssertionError ? '\n⚠️ Assertion: true' : ''),
      '\n📋 Raw value:',
      error,
    );
  }
}
