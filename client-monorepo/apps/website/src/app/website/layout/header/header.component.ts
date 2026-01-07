import { AfterViewInit, Component, ElementRef, HostListener, inject, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { WebsiteMenuItem } from '../../../api/clients/models/layout/menus.response';
import { LayoutService } from '../../services/layout.service';
import { BehaviorSubject, delay, Observable, of, Subscription } from 'rxjs';
import { Banner } from '../../../api/clients/models/content/banner';
import { BlogClient } from '../../../api/clients/blog-client';
import { UiDialogLoginComponent } from '../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import { ModalBanner } from '../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { UserService } from '../../../core/services/user.service';
import { UserProfileResponse } from '../../../api/digipay/models/user-profile.response';
import { map } from 'rxjs/operators';
import { BaseHttpClient } from '../../../api/base-http-client';
import { DialogBottomSheetService } from '../../../core/services/dialog-bottom-sheet.service';
import { LoggedInUser } from '../../../api/digipay/models/logged-in-user.model';
import { DownloadSectionData } from '../../../api/clients/models/templates/download/download-data.response';
import { DeviceService } from '../../../core/services/device/device.service';
import { WebViewService } from '../../../core/services/web-view.service';
import { CollapsiblePlusSignComponent } from '../../../ui/ui-components/ui-icons/collapsible-plus-sign/collapsible-plus-sign.component';
import { DownloadAppLinkDirective } from '../../../ui/ui-directive/download-app-link.directive';
import { UiSpinnerComponent } from '../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { RouterLink } from '@angular/router';
import { UiHamburgerIconComponent } from '../../../ui/ui-components/ui-menu/ui-hamburger-icon/ui-hamburger-icon.component';
import { UiBannerComponent } from '../../../ui/ui-components/ui-banner/ui-banner/ui-banner.component';
import { isPlatformBrowser, NgClass, NgFor, NgIf, NgOptimizedImage, NgStyle } from '@angular/common';
import { UiIconDirective } from '../../../ui/ui-directive/ui-icon.directive';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../core/models/storage-schema';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-l-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    UiBannerComponent,
    UiHamburgerIconComponent,
    RouterLink,
    NgOptimizedImage,
    NgFor,
    NgStyle,
    UiButtonComponent,
    UiSpinnerComponent,
    UiIconDirective,
    DownloadAppLinkDirective,
    CollapsiblePlusSignComponent,
    NgxIcon,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  public loggedInUser = new BehaviorSubject<any>(null);

  @Input()
  darkMode = false;

  topBanner!: Banner;

  @Input()
  modalBanner!: ModalBanner;

  @Input()
  menuItems: WebsiteMenuItem[] = [];

  @Input()
  justShowLogo = false;

  sideNavOpen = false;

  megaMenuOpenForIndex: number | null = null;

  expandedChildIndex: number | null = null;

  fadeInNavbarData = false;

  grandChildIndex = -1;

  bannerSubscription!: Subscription;

  showLoginDropdown = false;

  cellNumber = '';

  username = '';
  downloadApp: DownloadSectionData | undefined = undefined;

  checkedMenu = false;

  topMenuItems: any;

  isWebView = true;
  private eventService = inject(NgxEventTrackerService);

  constructor(
    private deviceService: DeviceService,
    private layoutService: LayoutService,
    private client: BlogClient,
    private elem: ElementRef,
    private userService: UserService,
    private apiService: BaseHttpClient,
    private dialog: DialogBottomSheetService,
    private webViewService: WebViewService,
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.apiService.api = 'digipay';
    this.isWebView = this.webViewService.isWebView();
  }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    if (!this.elem.nativeElement.contains(event.target)) {
      this.showLoginDropdown = false;
    }
  }

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    this.fadeInNavbarData = scroll > 0;
  }

  ngOnInit(): void {
    this.bannerSubscription = this.layoutService.banner.asObservable().subscribe((banner) => {
      this.topBanner = banner;
    });

    if (!this.justShowLogo && typeof window !== 'undefined' && localStorage) {
      this.getLoggedInUserDataFromApi();
    }

    this.loggedInUser.subscribe((userData: LoggedInUser) => {
      if (userData) {
        this.username = userData.name;
      }
    });

    this.checkedMenu = this.checkMenu();

    this.topMenuItems = this.getMenuByPosition('TOP');
  }

  ngAfterViewInit() {
    this.userService.currentUser().then((user) => {
      this.cellNumber = user.cellNumber;
    });
  }

  ngOnDestroy(): void {
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

  logout() {
    if (this.isWebView) {
      this.webViewService.close();
    } else {
      this.apiService
        .post('users/logout', {
          deviceId: this.deviceService.generateDeviceUid(),
        })
        .subscribe({
          next: () => {
            if (isPlatformBrowser(this.platformId)) {
              this.eventService.logoutIntrack();
            }

            of('')
              .pipe(delay(200))
              .subscribe({
                next: () => {
                  this.userService.logout(true);
                },
              });
          },
        });
    }
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.apiService.get('users/profile').pipe(
      map((data) => {
        return data;
      }),
    );
  }

  getLoggedInUserDataFromApi(): void {
    const auth = this.storage.get('auth.access', '');
    if (auth) {
      this.getUserProfile().subscribe(
        (data) => {
          this.loggedInUser.next(data.userDetail);
        },
        () => {
          this.loggedInUser.next(null);
        },
      );
    }
  }

  displayMegaMenu(itemIndex: number, menu: any, show: boolean, hover: boolean, mobile: boolean) {
    if (show) {
      if ('مجله اینترنتی دیجی پی' !== menu.title) {
        if (this.megaMenuOpenForIndex === itemIndex && !hover) {
          this.megaMenuOpenForIndex = null;
        } else this.megaMenuOpenForIndex = itemIndex;
        if (!mobile) {
          this.displayGrandChild(0, event, menu, menu.menu.menuItems[0], false, true);
        }
      } else {
        this.megaMenuOpenForIndex = null;
        if (!hover) {
          window.open('mag', '_blank');
        }
      }
    } else this.megaMenuOpenForIndex = null;
  }

  hideBackdrop() {
    this.megaMenuOpenForIndex = null;
    this.sideNavOpen = false;
  }

  displayGrandChild(itemIndex: number, $event: any, menu: any, child: any, mobile: boolean, show: boolean) {
    if (show) {
      if (child && child.slug) {
        // this.client.getPostByCategorySlug(child.slug, 4).subscribe((res) => {
        //   if (menu.groups[itemIndex] && menu.groups[itemIndex].items.length === 0) {
        //     for (const post of res.items) {
        //       menu.groups[itemIndex].items.push(post);
        //     }
        //   }
        // });
      }
      if (mobile && this.grandChildIndex === itemIndex) {
        this.grandChildIndex = -1;
      } else this.grandChildIndex = itemIndex;
      $event.stopPropagation();
    } else this.grandChildIndex = -1;
  }

  toggleSideNavChild(itemIndex: number) {
    if (3 == itemIndex) {
      this.expandedChildIndex = null;
      window.open('mag', '_self');
    }
    if (this.expandedChildIndex === itemIndex) {
      this.expandedChildIndex = null;
    } else {
      this.expandedChildIndex = itemIndex;
    }
  }

  getMenuByPosition(position: string) {
    let menu: any;
    if (this.menuItems) {
      menu = this.menuItems.find((o) => o.position === position);
    }
    if (menu) {
      return menu;
    } else return {};
  }

  checkMenu() {
    return !!(
      (this.getMenuByPosition('TOP').children &&
        this.getMenuByPosition('TOP').children.length > 0 &&
        this.getMenuByPosition('TOP').children[this.megaMenuOpenForIndex || 0].groups[
          this.grandChildIndex > -1 ? this.grandChildIndex : 0
        ] &&
        this.getMenuByPosition('TOP').children[this.megaMenuOpenForIndex || 0].groups[this.grandChildIndex > -1 ? this.grandChildIndex : 0]
          .banner &&
        this.getMenuByPosition('TOP').children[this.megaMenuOpenForIndex || 0].groups[this.grandChildIndex > -1 ? this.grandChildIndex : 0]
          .banner.firstCta &&
        this.getMenuByPosition('TOP').children[this.megaMenuOpenForIndex || 0].groups[this.grandChildIndex > -1 ? this.grandChildIndex : 0]
          .banner.firstCta.link &&
        this.getMenuByPosition('TOP').children[this.megaMenuOpenForIndex || 0].groups[this.grandChildIndex > -1 ? this.grandChildIndex : 0]
          .banner.title) ||
      (this.getMenuByPosition('TOP') &&
        this.getMenuByPosition('TOP').banner &&
        this.getMenuByPosition('TOP').banner.firstCta &&
        this.getMenuByPosition('TOP').banner.firstCta.link &&
        this.getMenuByPosition('TOP').banner.title)
    );
  }

  openLoginDialog(): void {
    this.dialog.open(UiDialogLoginComponent, {});
  }

  toggleLoginDropDown() {
    this.sideNavOpen = false;
    this.showLoginDropdown = !this.showLoginDropdown;
  }
}
