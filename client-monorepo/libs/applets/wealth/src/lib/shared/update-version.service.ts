import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { VersionService } from '../components/core/services/version.service';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

@Injectable({
  providedIn: 'root',
})
export class UpdateVersionService {
  VERSION = '0.1.3';
  appVersion = '';
  navigationService = inject(WealthNavigationService);

  constructor(
    private swUpdate: SwUpdate,
    public versionService: VersionService,
  ) {}

  // This method check if we are on the home route or not.
  private checkRouteIsSafe(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('checking route is safe');
      const currentUrl = window.location.pathname;
      if (currentUrl.includes('/mini-app/wealth') || window.location.origin.includes('wealth.mydigipay')) {
        resolve(true);
      }
      this.navigationService.onNavigationEvents().subscribe((event) => {
        console.log('navigationService');
        if (event instanceof NavigationEnd) {
          const endUrl = this.navigationService.getCurrentUrl();
          if (!endUrl.includes('/mini-app/wealth') && !window.location.origin.includes('wealth.mydigipay')) {
            return;
          }
          resolve(true);
        }
      });
    });
  }

  checkUpdate(): Promise<boolean> {
    console.log('checking for update first time');
    return new Promise((resolve) => {
      if (!this.swUpdate.isEnabled) {
        console.warn('SERVICE WORKER IS NOT ENABLED');
        resolve(true);
        return;
      }
      interval(60 * 1000).subscribe(() => {
        console.log('checking for update again');
        this.checkServiceWorkerUpdate();
      });
      this.swUpdate.versionUpdates.subscribe({
        next: (event) => {
          if (event.type !== 'VERSION_READY') {
            console.log('version is not ready');
            this.appVersion = this.VERSION;
            resolve(true);
            return;
          }
          this.checkRouteIsSafe().then(() => {
            this.swUpdate.activateUpdate().then(() => {
              document.location.reload();
            });
          });
        },
      });
      this.checkServiceWorkerUpdate();
    });
  }

  private checkServiceWorkerUpdate() {
    this.swUpdate
      .checkForUpdate()
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  }

  getAppVersion() {
    return this.appVersion || this.versionService.appVersion;
  }
}
