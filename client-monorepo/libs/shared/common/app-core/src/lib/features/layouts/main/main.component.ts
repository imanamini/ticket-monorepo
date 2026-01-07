import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { OverlayManagerComponent } from '@client-monorepo/common/ui-components';
import { NgxBottomNavigationService, NgxBottomNavigationWrapperComponent } from '@digipay/ngx-bottom-navigation';
import {
  AbTestService,
  AppNameService,
  EmitterService,
  EmittingDataEnum,
  LayoutService,
  MessageService,
  StorageService,
} from '@client-monorepo/common/utilities';
import { filter, fromEvent, Subscription } from 'rxjs';
import { UserApiService } from '@client-monorepo/common/user';
import { ErrorPageComponent } from '@client-monorepo/common/network';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomSheetComponent } from '@digipay/ngx-bottom-sheet';
import { PinLayoutComponent, PinLayoutService } from '@client-monorepo/common/pin';
import { CheckVpnApiService } from '../../../data-access/services/check-vpn-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DigikalaHeaderService, DigikalaService, DigikalaSuperWebService } from '@client-monorepo/pillar/digikala';
import { PillarSuperWebHeaderComponent } from '../pillar-super-web-header/pillar-super-web-header.component';

@Component({
  selector: 'dpx-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgxBottomNavigationWrapperComponent,
    OverlayManagerComponent,
    ErrorPageComponent,
    NgxBottomSheetComponent,
    PinLayoutComponent,
    PillarSuperWebHeaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  private storageService = inject(StorageService);
  private elementRef = inject(ElementRef);
  private emitterService = inject(EmitterService);
  private backHandler = inject(BackHandlerService);
  @ViewChild('navigationArea', { static: false }) navigationArea!: ElementRef;
  layoutBody = viewChild<ElementRef>('layoutBody');
  emitted = false;
  expanded = signal<boolean>(true);
  initialHeight = 0;
  bottomNavigationService = inject(NgxBottomNavigationService);
  routerSubscription!: Subscription;
  activatedRoute = inject(ActivatedRoute);
  userApiService = inject(UserApiService);
  layoutService = inject(LayoutService);
  pinLayoutService = inject(PinLayoutService);
  appNameService = inject(AppNameService);
  private checkVpnApiService = inject(CheckVpnApiService);
  private messageService = inject(MessageService);
  private digikalaHeaderService = inject(DigikalaHeaderService);
  private digikalaService = inject(DigikalaService);
  private destroyRef = inject(DestroyRef);
  containerStyle = computed(() => {
    const padding = this.layoutService.hasScrolled() ? this.bottomNavigationService.reservedHeight() : 0;
    return {
      paddingBottom: `${padding}px`,
    };
  });
  isVisiblePinLayout = computed(() => this.pinLayoutService.isVisible());

  loadedSupportMessenger = false;
  @ViewChild('scriptWrapper') scriptWrapper!: ElementRef<HTMLDivElement>;
  isVisibleGoftino = signal(false);
  abTestService = inject(AbTestService);
  scrolling = false;
  scrollTimeout!: NodeJS.Timeout;

  leftPosition = computed(() => {
    if (this.appNameService.isDpx()) {
      return '20px';
    } else {
      return '20px';
    }
  });

  rightPosition = computed(() => {
    if (this.appNameService.isDpx()) {
      return '20px';
    } else {
      return '20px';
    }
  });

  bottomNavMode = computed(() => {
    if (this.appNameService.isPillar()) {
      return 'fixed';
    } else {
      return 'floating';
    }
  });

  constructor() {
    this.backHandler.init();
  }

  ngOnInit() {
    this.initComponent();
    // Register native back handler for Pillar app
    if (this.appNameService.isPillar() && this.digikalaService.isDigikalaSuperApp) {
      this.digikalaService.onBackHandler(() => {
        this.backHandler.goBack();
      });
    }
    if (this.storageService.isLoggedIn()) {
      this.abTestService.getUserChannels().subscribe();
    }

    this.emitterService.sharedData.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (event) => {
        if (event === EmittingDataEnum.USER_HAS_LOGGED_IN) {
          this.abTestService.getUserChannels().subscribe();
        }
      },
    });
  }

  initComponent(): void {
    const element = this.elementRef?.nativeElement?.ownerDocument.body;
    this.initialHeight = element.clientHeight;
  }

  ngAfterViewInit() {
    this.subscribeToVerticalScroll();
    this.initDigikalaScrollThreshold();
    setTimeout(() => {
      this.checkVpnStatus();
    }, 3000);
  }

  private initDigikalaScrollThreshold(): void {
    this.digikalaHeaderService.initScrollThreshold();
  }

  private checkVpnStatus(): void {
    if (!this.isVpnCheckTimeStampExpired()) return;
    this.checkVpnApiService.checkVpnApiCall().subscribe({
      error: (err) => {
        if (err.status === 403 && !err?.error?.result?.status) {
          this.storageService.setVpnCheckTimeStamp(Date.now());
          const message = 'فیلتر شکن شما فعال است';
          const description = 'تجربه کاربری بهتر بدون فیلتر شکن';
          this.messageService.showWarningMessage(message, description, {
            showButton: false,
            buttonText: '',
            closeButton: true,
          });
        }
      },
    });
  }
  // ttl time is 24hours
  private isVpnCheckTimeStampExpired(ttl = 24 * 60 * 60 * 1000): boolean {
    const now = Date.now();
    const timeStamp = this.storageService.getVpnCheckTimeStamp();
    if (!timeStamp) {
      return true;
    } else {
      return now - timeStamp > ttl;
    }
  }

  handleScroll(event: any): void {
    if (this.layoutBody()?.nativeElement === event.currentTarget) {
      const currentScrollTop = this.layoutBody()?.nativeElement.scrollTop || 0;
      const pos = currentScrollTop + this.layoutBody()?.nativeElement.offsetHeight;
      const max = this.layoutBody()?.nativeElement.scrollHeight;

      // Existing scroll-to-end logic
      if (pos >= max - 50) {
        if (!this.emitted) {
          this.emitterService.emitEvent(EmittingDataEnum.MAIN_LAYOUT_SCROLLED_TO_END);
          this.emitted = true;
        }
      } else {
        this.emitted = false;
      }

      this.digikalaHeaderService.handleScroll(currentScrollTop);
    }
  }

  subscribeToVerticalScroll(): void {
    fromEvent(this.layoutBody()?.nativeElement, 'scroll').subscribe(() => {
      this.scrolling = true;
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.scrolling = false;
      }, 200);
    });

    fromEvent<TouchEvent>(this.layoutBody()?.nativeElement, 'touchend')
      .pipe(filter(() => this.scrolling))
      .subscribe((event: TouchEvent) => {
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.backHandler.destroy();
  }
}
