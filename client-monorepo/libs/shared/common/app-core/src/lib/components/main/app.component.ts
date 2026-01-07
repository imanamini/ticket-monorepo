import { AfterViewInit, Component, DestroyRef, Inject, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VersioningService } from '@client-monorepo/versioning';
import { ApiImageService } from '@digipay/ng-ui-api-image';
import { debounceTime, defer, Observable, of, Subscription, timer, zip } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import {
  AbTestService,
  AppNameService,
  EmitterService,
  EmittingDataEnum,
  LayoutService,
  StorageService,
} from '@client-monorepo/common/utilities';
import { Title } from '@angular/platform-browser';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { IdleTrackerService } from '@client-monorepo/common/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationService } from '@client-monorepo/common/location-management';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ErudaService, feedBackParamsModel, FeedbackSheetComponent, OpenFeedbackInterface } from '@client-monorepo/app-core';
import { StoresService } from '@client-monorepo/stores';

declare const window: OpenFeedbackInterface | any;

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'dpx-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'dpx';
  private versioning = inject(VersioningService);
  bottomSheetService = inject(NgxBottomSheetService);
  apiImageService = inject(ApiImageService);
  router = inject(Router);
  private readonly regex = /[^?]*/;
  private titleService = inject(Title);
  layoutService = inject(LayoutService);
  eventTracker = inject(NgxEventTrackerService);
  private ngxHybridService = inject(NgxHybridService);
  private idleTrackerService = inject(IdleTrackerService);
  private storageService = inject(StorageService);
  private emitterService = inject(EmitterService);
  private storesService = inject(StoresService);
  untilDestroy = inject(DestroyRef);
  private locationService = inject(LocationService);
  private eventManagementService = inject(EventManagementService);
  private appNameService = inject(AppNameService);
  isResizing = signal(false);
  private isGettingLocation = signal(false);
  private checkHybridVersionInterval: ReturnType<typeof setInterval>;
  private cleanupVisibilityTracker: () => void = () => {};
  subRouter!: Subscription;
  route = inject(ActivatedRoute);
  private readonly erudaService = inject(ErudaService);

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.versioning.run();
    this.apiImageService.prefixUrl = this.environment[AbTestService.callApiWithAbsoluteUrl() ? 'base_url_origin_abs' : 'base_url_origin'];
    const queryParams = Object.fromEntries(new URLSearchParams(location.search));
    if (queryParams['utm_source']) {
      this.storageService.setInputUtmData({
        source: queryParams['utm_source'],
        campaign: queryParams['utm_campaign'],
        medium: queryParams['utm_medium'],
      });
    }
  }

  ngOnInit(): void {
    if (process.env['name'] === 'staging' || AbTestService.showEruda()) {
      this.erudaService.initializeEruda();
    }
  }

  ngAfterViewInit(): void {
    this.monkeyPatchWindowOpen();
    this.handleAppInitialization();
    this.eventTracker.init();
    if (this.appNameService.isDpx()) {
      this.eventTracker.initIntrackOnSiteMessaging();
      this.eventTracker.initIntrackWebPush();
    }
  }

  monkeyPatchWindowOpen(): void {
    const originalWindowOpen = window.open;
    const timestamp = Date.now();

    const patchedWindowOpen = (url?: string | URL, target?: string, features?: string): Window | null => {
      const urlStr = typeof url === 'string' ? url : (url?.toString() ?? '');

      const shouldSetRedirectionTimestamp =
        urlStr &&
        this.idleTrackerService.validPathOnSetRedirectionTimestamp() &&
        (this.ngxHybridService.isAndroidHybrid() || target === '_blank');

      if (shouldSetRedirectionTimestamp) {
        this.storageService.setRedirectionTimestamp(timestamp);
      }

      return originalWindowOpen.call(window, urlStr, target, features || '');
    };

    window.open = patchedWindowOpen.bind(this);
  }

  private initVisibilityTracker(): Observable<void> {
    return defer(() => {
      const isLoggedIn = this.storageService.isLoggedIn();
      const { cleanup, visibilityCallbackInvoked } = this.idleTrackerService.initVisibilityTracker(() => {});
      this.storageService.removeRedirectionTimestamp();
      this.cleanupVisibilityTracker = cleanup;

      if (!visibilityCallbackInvoked || !isLoggedIn) {
        return of(undefined);
      }

      this.storageService.expireToken();
      return of(undefined);
      // TODO: Use this part after adding token expiration by backend
      // return this.tacService.getTac().pipe(
      //   catchError(() => of(null)),
      //   map(() => undefined),
      // );
    });
  }

  private handleAppInitialization(): void {
    zip([timer(3000), this.initVisibilityTracker()]).subscribe({
      next: () => this.finalizeAppInit(),
      error: () => this.finalizeAppInit(),
    });
  }

  private finalizeAppInit(): void {
    document.getElementById('splash_bg')?.remove();
    document.getElementById('nativeSplash')?.remove();
    window.showSplash = false;
    this.subscribeToHorizontalResize();
    this.titleServiceRouterEvent();
    this.observeAppState();
    this.afterLoginInitialize();
    this.openFeedBackModal();
  }

  afterLoginInitialize() {
    if (this.storageService.isLoggedIn()) {
      this.sendVisitEvent();
      this.getUserLocation();
      this.checkHybridVersionAvailable();
    }
    this.emitterService.sharedData.pipe(takeUntilDestroyed(this.untilDestroy)).subscribe({
      next: (event) => {
        if (event === EmittingDataEnum.USER_HAS_LOGGED_IN) {
          this.sendVisitEvent();
          this.getUserLocation();
          this.checkHybridVersionAvailable();
        }
      },
    });
  }

  private getUserLocation() {
    const safeRoutes = ['/stores'];
    const currentRoute = window.location.pathname;
    if (safeRoutes.indexOf(currentRoute) !== -1) {
      if (this.subRouter) {
        this.subRouter.unsubscribe();
      }
      if (this.locationService.checkLocationCollection()) {
        this.isGettingLocation.set(true);
        this.locationService.getLocation(false, this.storesService.ttlForOptionalLocation).subscribe({
          next: (res) => {
            if (res) {
              this.sendLocation(res.latitude, res.longitude);
            }
            this.isGettingLocation.set(false);
          },
          error: () => {
            this.isGettingLocation.set(false);
          },
        });
      }
    } else {
      if (this.subRouter) {
        this.subRouter.unsubscribe();
      }
      this.subRouter = this.router.events.pipe(takeUntilDestroyed(this.untilDestroy)).subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.getUserLocation();
        }
      });
    }
  }

  private checkHybridVersionAvailable(): void {
    if (!this.ngxHybridService.isAndroidHybrid()) return;
    this.checkHybridVersionInterval = setInterval(() => {
      if (this.isGettingLocation() || this.versioning.isUpdating() || window.isGettingPassword) return;
      this.versioning.checkHybridVersion();
      clearInterval(this.checkHybridVersionInterval);
    }, 5000);
  }

  private sendLocation(latitude: number, longitude: number): void {
    this.eventManagementService.sendLocation(latitude, longitude);
    this.storageService.setLocationEventTimeStamp(Date.now());
  }

  private observeAppState(): void {
    if (!this.ngxHybridService.isAndroidHybrid()) return;
    this.idleTrackerService.observeAppStateChange();
  }

  subscribeToHorizontalResize(): void {
    this.layoutService
      .onHorizontalResize()
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.isResizing.set(true);
        setTimeout(() => {
          this.isResizing.set(false);
        }, 10);
      });
  }

  private openFeedBackModal(): void {
    window.openFeedback = (params: feedBackParamsModel) => {
      this.bottomSheetService.openBottomSheet(FeedbackSheetComponent, { feedBackData: params }, { height: '70%' });
    };
  }
  private titleServiceRouterEvent() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.titleService.setTitle('دیجی‌پی | خدمات مالی و پرداخت'); // Reset the title after navigation
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupVisibilityTracker(); // Remove listener
    if (this.checkHybridVersionInterval) {
      clearInterval(this.checkHybridVersionInterval);
    }
  }

  sendVisitEvent(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'visit',
      data: null,
    });
  }
}
