import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LayoutClient } from '../../../api/clients/layout-client';
import { WebsiteMenuItem } from '../../../api/clients/models/layout/menus.response';
import { Banner } from '../../../api/clients/models/content/banner';
import { ModalBanner } from '../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../core/models/storage-schema';
import { MessageService } from '@client-monorepo/common/utilities';
import { DOCUMENT, isPlatformBrowser, NgIf } from '@angular/common';
import { DeviceService } from '../../../core/services/device/device.service';
import { NewHeaderComponent } from '../new-header/new-header.component';
import { NewFooterComponent } from '../new-footer/new-footer.component';
import { MenuService } from '../menu.service';
import { BottomNavigationComponent } from '../bottom-navigation/bottom-navigation.component';
import { CtaBottomSheetComponent } from '../cta-bottom-sheet/cta-bottom-sheet.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CtaConfig, CtaService } from '../cta-bottom-sheet/cta.service';
import { filter } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
  standalone: true,
  imports: [NgIf, NewHeaderComponent, NewFooterComponent, BottomNavigationComponent, CtaBottomSheetComponent],
})
export class BaseLayoutComponent implements OnInit, OnChanges {
  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef;
  @ViewChild('footer', { static: false }) footer!: ElementRef;
  @ViewChild('bottomNavigation', { static: false }) bottomNavigation!: ElementRef;

  private menuService = inject(MenuService);

  @Input()
  darkMode = false;

  @Input()
  showHeader = true;

  @Input()
  showFooter = true;

  @Input()
  isHome = false;

  @Input()
  loaded = false;

  @Input()
  modalBanner!: ModalBanner;

  @Input()
  justShowLogo = false;

  banner!: Banner;

  mainMenuItems: WebsiteMenuItem[] = [];
  inAppPreviewHiddenFlag = false;

  isMobile = false;
  isMobileMode = false;

  private router = inject(Router);
  private ctaService = inject(CtaService);

  readonly cta = this.ctaService.cta;

  showCtaBottomSheet = signal(true);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private layoutClient: LayoutClient,
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) public platformId: string,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
  ) {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && localStorage) {
      // read from the cache at initialization
      this.mainMenuItems = this.storage.getAll().menuItems || [];
      effect(() => {
        this.decideForDevice();
      });
    }
    effect(
      () => {
        const isOpen = this.menuService.menuOpen$();
        const scrollVisibility = this.ctaService.scrollVisible();

        if (scrollVisibility === null) {
          this.showCtaBottomSheet.set(true);
        } else {
          this.showCtaBottomSheet.set(scrollVisibility);
        }

        if (this.contentContainer) {
          this.contentContainer.nativeElement.style.display = isOpen ? 'none' : 'block';
        }
        if (this.footer) {
          this.footer.nativeElement.style.display = isOpen ? 'none' : 'block';
        }
        if (this.bottomNavigation) {
          this.bottomNavigation.nativeElement.style.display = isOpen ? 'none' : 'block';
        }

        const currentUrl = this.router.url;
        this.inAppPreviewHiddenFlag = this.route.snapshot.queryParamMap.get('inAppPreview') === 'yes';
        if (!currentUrl.startsWith('/bnpl/c-bnpl')) {
          this.updateCta(currentUrl);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId) && this.loaded === true) {
      this.addLoadedClass();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }

  private updateCta(url: string) {
    const routeMap: Record<string, CtaConfig> = {
      '/careers': {
        icon: 'group',
        iconType: 'due',
        iconSize: '20px',
        text: 'موقعیت‌های شغلی',
        link: 'https://career.hrcando.ir/co/digipay',
        ctaTitle: 'مشاهده',
        textStyles: 'c-2 text-oninvert-high',
      },
      '/credit/c-credit': {
        icon: 'credit',
        iconType: 'due',
        iconSize: '20px',
        text: 'وام فوری و بدون ضامن',
        link: environment.appUrl + '/service/credit/resolve?referrer=website-sticky',
        ctaTitle: 'دریافت وام',
        textStyles: 'c-2 text-oninvert-high',
      },
      '/bnpl/c-bnpl': {
        icon: 'bnpl',
        iconType: 'due',
        iconSize: '20px',
        text: 'اعتبار خرید اقساطی',
        link: '',
        ctaTitle: 'درخواست اعتبار',
        textStyles: 'c-2 text-oninvert-high',
      },
    };

    const match = Object.entries(routeMap).find((entry) => {
      const path = entry[0];
      return url.startsWith(path);
    });

    this.ctaService.setCta(match ? match[1] : null);
  }

  addLoadedClass() {
    if (isPlatformBrowser(this.platformId)) {
      const el = this.document.getElementById('app-loading');
      if (el) {
        el.classList.add('loaded');
      }
    }
  }

  decideForDevice(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = this.deviceService.isMobileSignal();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobileMode = window.innerWidth <= 1280;
  }
}
