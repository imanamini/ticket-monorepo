import { Inject, inject, Injectable, signal } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { combineLatest, filter, first, from, interval, map, Observable, of, startWith, switchMap, take } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { AppNameService, MessageService, StorageService } from '@client-monorepo/common/utilities';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { VersionApiService } from './version-api.service';
import { VersionResponse } from '../models/latest-version-response.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NativeVersionSheetComponent } from '../../components/native-version-sheet/native-version-sheet.component';
import { WebVersion } from '../models/web-version.model';
import * as Sentry from '@sentry/angular-ivy';
import { EventManagementService } from '@client-monorepo/common/event-management';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class VersioningService {
  private swUpdate = inject(SwUpdate);
  private loginStateService = inject(LoginStateService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private ngxHybridService = inject(NgxHybridService);
  private versionApiService = inject(VersionApiService);
  private ngxBottomSheetService = inject(NgxBottomSheetService);
  private storageService = inject(StorageService);
  private appNameService = inject(AppNameService);
  private eventManagementService = inject(EventManagementService);
  private versions = { latestVersion: '', currentVersion: '' };
  private readonly checkPeriodTime = 60 * 1000;
  public isUpdating = signal(false);
  private safeRoute: string[] = [
    '/auth/onboarding',
    '/hub',
    '/service/credit/overview',
    '/service/credit/pre-register',
    '/subscription',
    '/subscription/subscription-management',
    '/home',
  ];

  private readonly UPDATE_MODE_PATH_FILE = '/assets/update-config.json';

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    if (parseInt(this.environment['version_check_period_seconds'])) {
      this.checkPeriodTime = parseInt(this.environment['version_check_period_seconds']) * 1000;
    }
  }

  public run() {
    if (!this.swUpdate.isEnabled) {
      console.warn('SERVICE WORKER IS NOT ENABLED');
      return;
    }
    this.invoke();
    this.checkForUpdate();
    this.checkForUnrecoverableState();
  }
  public checkHybridVersion(): void {
    if (!this.ngxHybridService.isAndroidHybrid() || this.isUpdating()) return;
    this.versionApiService.getNativeVersionApi().subscribe({
      next: (res: VersionResponse) => {
        if (!res.latest && this.checkVersionTtl()) {
          this.isUpdating.set(true);
          this.ngxBottomSheetService.openBottomSheet(
            NativeVersionSheetComponent,
            { newVersion: res?.latestVersion },
            { disableClose: true },
          );
          const sheetSub = this.ngxBottomSheetService.onClose.subscribe(() => {
            sheetSub.unsubscribe();
            const result = this.ngxBottomSheetService.outputData();
            if (result && result.isAllowed) {
              // Navigate user to the app store to get the latest version
              window.open(res?.storeUrl, '_blank');
            }
            this.storageService.setNativeUpdateTimeStamp(Date.now());
            this.isUpdating.set(false);
          });
        }
      },
    });
  }

  invoke() {
    try {
      this.swUpdate.versionUpdates.subscribe({
        next: (versionState: VersionEvent) => {
          this.safeToUpdate().subscribe((canUpdate) => {
            if (!canUpdate || versionState.type !== 'VERSION_READY') return;

            fetch(`${this.UPDATE_MODE_PATH_FILE}?cache-bust=${Date.now()}`)
              .then((response) => response.json())
              .then((data) => {
                const newUpdateMode: boolean = data.new_update_mode;
                const latestHash = versionState.latestVersion.hash;
                const currentHash = window.__NGSW_HASH__;
                this.versions = { latestVersion: latestHash, currentVersion: currentHash };

                const shouldReload: boolean = !newUpdateMode || (newUpdateMode && latestHash !== currentHash);

                if (shouldReload) {
                  this.refreshAfterUpdate();
                }
              })
              .catch(() => {
                this.refreshAfterUpdate();
              });
          });
        },
      });
    } catch (e) {
      console.error('versioning service: ', e);
      this.isUpdating.set(false);
    }
  }

  private refreshAfterUpdate() {
    this.isUpdating.set(true);
    // const urlObj = new URL(window.location.href);
    // const pageUrl = urlObj.pathname;
    // const { latestVersion, currentVersion } = this.versions;
    // const dataValue = {
    //   reloadCauseRoot: 'versioning-service',
    //   latestVersion,
    //   currentVersion,
    // };
    // this.eventManagementService.triggerEvent(
    //   {
    //     eventType: 'custom',
    //     breadCrumbs: [pageUrl],
    //     data: {
    //       key: 'updateCount',
    //       value: JSON.stringify(dataValue),
    //     },
    //   },
    //   true,
    // );
    this.messageService.showInfoMessage('در حال دریافت جدیدترین تغییرات...');
    setTimeout(() => {
      this.reloadPage();
    }, 3000);
  }

  private checkVersionTtl(ttl = 1000 * 60 * 60 * 24 * 2): boolean {
    const lastTime = this.storageService.getNativeUpdateTimeStamp();
    if (!lastTime) {
      return true;
    }
    const now = Date.now();
    return now - lastTime >= ttl;
  }

  checkForUpdate(): void {
    const everyPeriodTime = interval(this.checkPeriodTime);
    everyPeriodTime.subscribe(async () => {
      try {
        const updateFound = await this.swUpdate.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }

  hasNewVersion(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.swUpdate
        .checkForUpdate()
        .then((updateFound) => {
          subscriber.next(updateFound);
          subscriber.complete();
        })
        .catch((err) => {
          console.error('Failed to check for updates:', err);
          subscriber.error(err);
          subscriber.complete();
        });
    });
  }
  /**
   * Returns an observable that emits the current and new version of the app
   * from the Angular service worker's version updates, using appData from ngsw-config.json.
   */
  getWebVersion(): Observable<WebVersion | null> {
    return combineLatest([this.getCurrentWebVersion(), this.watchForNewWebVersion()]).pipe(
      map(([currentVersion, newVersion]) => ({ currentVersion, newVersion })),
    );
  }
  /**
   * Fetches the current app version from the Angular Service Worker's `ngsw.json` file.
   *
   * The version is read from the `appData.version` property inside `ngsw.json`.
   */
  getCurrentWebVersion(): Observable<string | null> {
    return of(this.environment['appVersion'] || null);
  }
  /**
   * Observes the first new version available from the Service Worker.
   * Emits the version string or null initially.
   */
  watchForNewWebVersion(): Observable<string | null> {
    return this.swUpdate.versionUpdates.pipe(
      filter((event): event is Extract<VersionEvent, { type: 'VERSION_READY' }> => event.type === 'VERSION_READY'),
      first(),
      map((event: any) => event.latestVersion.appData?.version || null),
      startWith(null),
    );
  }
  private isLoginRoute(): boolean {
    const currentUrl = window.location.pathname;
    const loginRoute = ['/auth/login'];
    return loginRoute.indexOf(currentUrl) >= 0;
  }
  private checkRouteIsSafe(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.loginStateService.state() === LoginState.PHONENUMBER && this.isLoginRoute()) {
        resolve(true);
      }
      const currentUrl = window.location.pathname;
      const isSafe =
        this.safeRoute.indexOf(currentUrl) >= 0 ||
        currentUrl.startsWith('/mini-app/wealth') ||
        currentUrl.startsWith('/service/bnpl') ||
        this.appNameService.isPillar();
      if (isSafe) {
        resolve(true);
      }
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const endUrl = this.router.url;
          if (!this.safeRoute.includes(endUrl)) {
            return;
          }
          resolve(true);
        }
      });
    });
  }

  reloadPage(): void {
    document.location.reload();
  }

  checkForUnrecoverableState(): void {
    this.swUpdate.unrecoverable.subscribe((event) => {
      Sentry.captureException(new Error(`Service Worker Unrecoverable State: ${event.reason}`), {
        level: 'warning',
        tags: {
          component: 'VersioningService',
          errorType: 'sw_unrecoverable_state',
          appVersion: this.environment['appVersion'] || 'unknown',
        },
        contexts: {
          serviceWorker: {
            reason: event.reason,
            currentHash: (window as any).__NGSW_HASH__ || 'unknown',
            currentRoute: window.location.pathname,
            userAgent: navigator.userAgent,
          },
        },
        fingerprint: ['service-worker', 'unrecoverable-state'],
      });

      setTimeout(() => {
        document.location.reload();
      }, 1500);
    });
  }
  /**
   * Determines whether it is safe to perform a service worker update at this moment.
   * Waits for sensitive UI states to resolve before allowing the update, including:
   * - Open bottom sheets (e.g., hub onboarding sheet)
   * - Ongoing API requests
   * - Ongoing password entry
   * - Unsafe or transitional routes
   */
  private safeToUpdate(): Observable<boolean> {
    if (this.isUpdating() || window.isGettingPassword) {
      return of(false);
    }

    const sheetClosed$: Observable<boolean> = window.popupMessage
      ? interval(300).pipe(
          filter(() => !window.popupMessage),
          take(1),
          map(() => true),
        )
      : of(true);

    return sheetClosed$.pipe(
      switchMap((sheetReady) => {
        if (!sheetReady) return of(false);
        return from(this.checkRouteIsSafe()).pipe(
          map((isSafe) => isSafe),
          startWith(false),
        );
      }),
    );
  }
}
