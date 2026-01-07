import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerHandlerService {
  private readonly MAX_RETRIES = 3;
  private retryCount = 0;

  init(): Promise<void> {
    return new Promise((resolve) => {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('[ServiceWorkerHandler] Service workers are not supported in this browser');
        resolve();
        return;
      }

      // ===== Check for refresh loop =====
      // If we're in a refresh loop due to chunk errors, skip SW cleanup to avoid conflicts
      const REFRESH_COUNTER_KEY = 'chunk_error_refresh_count';
      try {
        const refreshCount = parseInt(sessionStorage.getItem(REFRESH_COUNTER_KEY) || '0', 10);
        if (refreshCount >= 2) {
          console.warn('[ServiceWorkerHandler] Multiple refreshes detected. Skipping SW cleanup to avoid conflicts.');
          resolve();
          return;
        }
      } catch (storageError) {
        console.warn('[ServiceWorkerHandler] Could not access sessionStorage:', storageError);
      }

      // Set up error handling for service worker registration
      this.setupErrorHandling();

      // Check for existing problematic registrations
      this.checkExistingRegistrations()
        .then(() => {
          // Mark that SW handler has run successfully
          try {
            sessionStorage.setItem('sw_handler_last_run', String(Date.now()));
          } catch (e) {
            // Ignore storage errors
          }
          resolve();
        })
        .catch((error) => {
          console.warn('[ServiceWorkerHandler] Error checking existing registrations:', error);
          resolve(); // Don't block app initialization
        });
    });
  }

  private setupErrorHandling(): void {
    // Listen for service worker errors globally
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('error', (event) => {
        console.warn('[ServiceWorkerHandler] Service worker error:', event);
      });

      // Monitor controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[ServiceWorkerHandler] Service worker controller changed');
      });
    }
  }

  private async checkExistingRegistrations(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      // Check for multiple or conflicting registrations
      if (registrations.length > 1) {
        console.warn('[ServiceWorkerHandler] Multiple service workers detected, cleaning up...');
        await this.cleanupConflictingRegistrations(registrations);
      }

      // Check for stale or problematic registrations
      for (const registration of registrations) {
        if (this.isProblematicRegistration(registration)) {
          console.warn('[ServiceWorkerHandler] Problematic service worker detected, unregistering...');
          await registration.unregister();
        }
      }
    } catch (error) {
      console.warn('[ServiceWorkerHandler] Error checking registrations:', error);
    }
  }

  private isProblematicRegistration(registration: ServiceWorkerRegistration): boolean {
    // Check if the registration is for our app
    const scope = registration.scope;
    const currentOrigin = window.location.origin;

    // If the scope doesn't match our origin, it might be problematic
    if (!scope.startsWith(currentOrigin)) {
      return true;
    }

    // Check if the service worker script is accessible
    if (registration.active) {
      const scriptUrl = registration.active.scriptURL;
      // If script is not from our domain, it's problematic
      if (!scriptUrl.startsWith(currentOrigin)) {
        return true;
      }
    }

    return false;
  }

  private async cleanupConflictingRegistrations(registrations: readonly ServiceWorkerRegistration[]): Promise<void> {
    const currentOrigin = window.location.origin;

    const validRegistrations = registrations.filter((reg) => reg.scope === `${currentOrigin}/`);

    const toUnregister = registrations.filter((reg) => !validRegistrations.includes(reg));

    for (const registration of toUnregister) {
      try {
        await registration.unregister();
        console.log('[ServiceWorkerHandler] Unregistered conflicting service worker:', registration.scope);
      } catch (error) {
        console.warn('[ServiceWorkerHandler] Error unregistering service worker:', error);
      }
    }
  }

  /**
   * Manually register service worker with error handling
   * This can be used as a fallback if Angular's automatic registration fails
   */
  async manuallyRegisterServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/ngsw-worker.js', {
        scope: '/',
      });

      console.log('[ServiceWorkerHandler] Service worker registered successfully:', registration.scope);
      this.retryCount = 0; // Reset retry count on success
      return registration;
    } catch (error) {
      console.warn('[ServiceWorkerHandler] Service worker registration failed:', error);

      // Retry with exponential backoff
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff
        console.log(`[ServiceWorkerHandler] Retrying in ${delay}ms (attempt ${this.retryCount}/${this.MAX_RETRIES})`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.manuallyRegisterServiceWorker();
      }

      console.warn('[ServiceWorkerHandler] Max retries reached, giving up on service worker registration');
      return null;
    }
  }

  /**
   * Unregister all service workers - useful for debugging
   */
  async unregisterAll(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('[ServiceWorkerHandler] Unregistered service worker:', registration.scope);
      }
    } catch (error) {
      console.warn('[ServiceWorkerHandler] Error unregistering all service workers:', error);
    }
  }
}
