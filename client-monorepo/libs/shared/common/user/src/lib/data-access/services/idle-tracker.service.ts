import { inject, Injectable, signal } from '@angular/core';
import { AndroidLifecycle, NgxHybridService } from '@digipay/ngx-hybrid-service';
import { StorageService } from '@client-monorepo/common/utilities';
import { TacService } from './tac.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
/**
 * This service is used to track the user's idle time when the app is moved to the background
 * and to prompt the user to enter their PIN upon returning.
 **/
export class IdleTrackerService {
  private ngxHybridService = inject(NgxHybridService);
  private storageService = inject(StorageService);
  private tacService = inject(TacService);
  private router = inject(Router);
  private RETURN_THRESHOLD = 1000;
  private readonly idleLimit = signal<number>(3 * 60 * 1000); // 3 minutes
  private readonly redirectionLimit = signal<number>(10 * 60 * 1000); // 10 minutes

  public observeAppStateChange(): void {
    this.ngxHybridService.getLifeCycleStatus().subscribe({
      next: (state) => {
        if (state == AndroidLifecycle.ON_PAUSE) {
          this.onAppGoesToBackground();
        }
        if (state == AndroidLifecycle.ON_RESUME) {
          this.onAppComesToForeground();
        }
      },
    });
  }
  private onAppGoesToBackground(): void {
    const currentTime = Date.now();
    this.storageService.setTimeStamp(currentTime);
  }

  private onAppComesToForeground() {
    const now = Date.now();
    const savedTime = this.storageService.getTimeStamp();

    if (!savedTime) return;

    const elapsed = now - parseInt(savedTime, 10);

    if (elapsed >= this.idleLimit()) {
      this.tacService.getTac().subscribe();
    }
  }

  /**
   * Initializes a visibility tracker that triggers a callback if the user returns
   * after a specified threshold and stores the time when the user leaves the page.
   *
   * @param callback - Function to be called when the user returns after being away for too long.
   * @returns A cleanup function to remove the event listener when tracking is no longer needed.
   */
  initVisibilityTracker(callback: () => void): { cleanup: () => void; visibilityCallbackInvoked: boolean } {
    const now = Date.now();
    const lastLeft = parseInt(localStorage.getItem('lastHiddenTime') || '0', 10);
    const redirectionTimestamp = this.storageService.getRedirectionTimestamp();
    let elapsed = 0;
    if (redirectionTimestamp) {
      elapsed = now - parseInt(redirectionTimestamp, 10);
    }
    // Skip callback if redirected and delay exceeded
    const shouldSkipCallback = lastLeft && redirectionTimestamp && elapsed <= this.redirectionLimit();

    // Check if there's an active session (used to differentiate between reload and full browser start)
    const hasSession = sessionStorage.getItem('activeSession');

    let visibilityCallbackInvoked = false;
    if (!shouldSkipCallback && !hasSession && lastLeft && now - lastLeft > this.RETURN_THRESHOLD) {
      visibilityCallbackInvoked = true;
      callback();
    }

    // Mark this session as active so the callback isn't triggered again during reloads
    sessionStorage.setItem('activeSession', 'true');

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('lastHiddenTime', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);

    const cleanup = () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };

    return { cleanup, visibilityCallbackInvoked };
  }

  validPathOnSetRedirectionTimestamp() {
    const whiteList = ['cash-in', 'service/c2c', 'profile/update', '/confirm'];
    return whiteList.some((str) => this.router.url.includes(str));
  }
}
