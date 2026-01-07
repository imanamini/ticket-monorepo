import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BranchModel,
  RecentlyViewedService,
  Store,
  StorePaymentMethod,
  StoreRestrictionFields,
  StoresApiService,
  StoreSearchBranchesConfig,
  StoreType
} from '@client-monorepo/stores';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { StoreOverviewComponent } from '../../components/store-overview/store-overview.component';
import { StoreIntroComponent } from '../../components/store-intro/store-intro.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { Subscription } from 'rxjs';
import {
  Rateable,
  RateApiService,
  RateBaseComponent,
  RateCountComponent,
  RateService
} from '@client-monorepo/common/rate';
import { AccordionConfig, NgxAccordionComponent } from '@digipay/ngx-accordion';
import { StoreBulletInfoComponent } from '../../components/store-bullet-info/store-bullet-info.component';
import { BranchOverviewComponent } from '../../components/store-branch-overview/branch-overview.component';
import { LocationService } from '@client-monorepo/common/location-management';
import { Voucher, VoucherCarouselComponent } from '@client-monorepo/vouchers';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxButtonComponent } from '@digipay/ngx-button';
import {
  StoreDiscountedProductsComponent
} from '../../components/store-discounted-products/store-discounted-products.component';
import {
  StoreMostVisitedProductsComponent
} from '../../components/store-most-visited-products/store-most-visited-products.component';
import { StoreVoucherGuidesComponent } from '../../components/store-voucher-guides/store-voucher-guides.component';
import { Banner, BannerCategory, MessageService } from '@client-monorepo/common/utilities';
import { BannersApiService, SharedCommonBannersComponent } from '@client-monorepo/libs/shared/common/banners';

@Component({
  selector: 'stores-applet-store',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgxBadgeModule,
    StoreOverviewComponent,
    ApiImageModule,
    RateCountComponent,
    NgxAccordionComponent,
    BranchOverviewComponent,
    NgxButtonComponent,
    StoreDiscountedProductsComponent,
    StoreMostVisitedProductsComponent,
    VoucherCarouselComponent,
    SharedCommonBannersComponent
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent implements OnInit, OnDestroy {
  trackingCode = signal<string>('');
  store = signal<Store | undefined>(undefined);
  activatedRoute = inject(ActivatedRoute);
  location = inject(Location);
  storeApi = inject(StoresApiService);
  router = inject(Router);
  actionHandler = inject(ActionHandlerService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  backHandler = inject(BackHandlerService);
  rateService = inject(RateService);
  rateApi = inject(RateApiService);
  locationService = inject(LocationService);
  recentlyViewedService = inject(RecentlyViewedService);
  destroyRef = inject(DestroyRef);
  bottomSheetService = inject(NgxBottomSheetService);
  private bannerApiService = inject(BannersApiService);
  private messageService = inject(MessageService);
  subs = new Subscription();
  protected readonly BannerCategory = BannerCategory;
  isDisabled = computed(() => this.store()?.state?.disabled);
  storeIntroAccordionConfig = computed<AccordionConfig<any>[]>(() => [
    {
      component: StoreIntroComponent,
      inputs: { store: this.store(), componentId: 'StoreIntro' },
      accordionTitle: 'معرفی فروشگاه',
      showDivider: false,
      isOpen: !this.vouchers()?.length && !!this.store() && this.storeDetailsAccordionConfig().length === 0,
      leadingTitleIcon: ''
    }
  ]);
  storeVoucherAccordionConfig = computed<AccordionConfig<any>[]>(() => [
    {
      component: StoreVoucherGuidesComponent,
      inputs: { componentId: 'StoreVoucherGuides' },
      accordionTitle: 'راهنمای استفاده از کد تخفیف:',
      showDivider: false,
      isOpen: true,
      leadingTitleIcon: ''
    }
  ]);
  showStoreDetailsAccordion = computed<boolean>(() => !!this.store()?.types.includes(StoreType.ONSITE));
  isSingleBranch = computed(() => (this.branches()?.length ?? 0) === 1);
  storeDetailsAccordionConfig = computed<AccordionConfig<any>[]>(() => {
    if (!this.showStoreDetailsAccordion()) {
      return [];
    }
    const val: AccordionConfig<StoreBulletInfoComponent>[] = [];
    this.store()?.paymentMethods.map((method) => {
      switch (method) {
        case StorePaymentMethod.QR_CODE:
          val.push({
            component: StoreBulletInfoComponent,
            inputs: {
              componentId: 'QrCodeScan',
              buttonText: 'اسکن کیوآر کد',
              buttonIcon: { name: 'barcode-scan' },
              buttonClickUrl: 'qr',
              bullets: [
                'اسکن QR کد موجود در فروشگاه و یا دریافت QR از فروشنده پس از وارد کردن اقلام خرید در فاکتور',
                'دریافت مبلغ نهایی و وارد کردن آن در اپلیکیشن و یا مشاهده فاکتور صادر شده پس از دریافت QR از فروشنده',
                'پرداخت مبلغ نهایی با اعتبار مورد نظر'
              ]
            },
            accordionTitle: 'اسکن QR',
            showDivider: false,
            isOpen: false,
            leadingTitleIcon: 'qr-scan'
          });
          break;
        case StorePaymentMethod.POS:
          val.push({
            component: StoreBulletInfoComponent,
            inputs: {
              componentId: 'CardReader',
              buttonText: 'اتصال به وام',
              buttonIcon: { name: 'link' },
              buttonClickUrl: 'profile/saved-cards',
              bullets: [
                'اتصال یکی از کارت‌های بانکی خود به وام مورد نظر',
                'کشیدن کارت در دستگاه کارت‌خوان فروشگاه',
                'پرداخت مبلغ نهایی با اعتبار مورد نظر'
              ]
            },
            accordionTitle: 'کارت خوان',
            showDivider: false,
            isOpen: false,
            leadingTitleIcon: 'bank-card'
          });
          break;
        case StorePaymentMethod.BARCODE:
          val.push({
            component: StoreBulletInfoComponent,
            inputs: {
              componentId: 'BarcodeCreation',
              buttonText: 'ایجاد بارکد',
              buttonIcon: { name: 'qr-scan' },
              buttonClickUrl: 'barcode',
              bullets: [
                'تعیین اعتبار مورد نیاز و انتخاب دکمه «دریافت بارکد پرداخت»',
                'نمایش بارکد و یا اعلام کد ۸ رقمی به فروشنده',
                'تایید نهایی اطلاعات و پرداخت'
              ]
            },
            accordionTitle: 'ایجاد بارکد',
            showDivider: false,
            isOpen: false,
            leadingTitleIcon: 'barcode-scan'
          });
          break;
      }
    });
    const length = val.length;
    if (length === 1 && !this.vouchers()?.length) {
      return val.map((v) => {
        return { ...v, isOpen: true };
      });
    }
    if (length > 1) {
      return val.map((v, index) => {
        if (index !== length - 1) {
          return { ...v, showDivider: true };
        } else {
          return v;
        }
      });
    } else {
      return val;
    }
  });
  size = 2;
  branches = signal<BranchModel[] | undefined>([]);
  showMoreStatus = signal<'visible' | 'hidden' | 'pending'>('hidden');
  vouchers = signal<Voucher[]>([]);
  crawled = computed(() => this.store()?.state?.crawled);
  storeBanner = signal<Banner[]>([]);

  eventManagementService = inject(EventManagementService);

  ngOnInit(): void {
    this.getLocation();
    this.getTrackingCode();
    this.loadRateables();
    this.getStore();
    this.bottomNavigationService.hide();
  }

  getVouchers(): void {
    this.storeApi.searchVouchers(0, 10, 'store-summary', true, this.trackingCode(), undefined, undefined).subscribe({
      next: (result) => {
        this.vouchers.set(result.vouchers);
      }
    });
  }

  getLocation(): void {
    this.locationService.getGuaranteedLocation().subscribe();
  }

  getStoreBranches(): void {
    if (!this.store()) {
      return;
    }
    const config: StoreSearchBranchesConfig = {
      size: this.size,
      storeTrackingCode: this.trackingCode(),
      mode: 'branch-only'
    };
    this.storeApi.searchBranches(config).subscribe((res) => {
      this.branches.set(res.branches);
      if (this.branches() && this.branches()!.length < res.totalElements) {
        this.showMoreStatus.set('visible');
      } else {
        this.showMoreStatus.set('hidden');
      }
    });
  }

  private loadRateables(): void {
    this.rateApi.getAllRatables().subscribe({
      next: (res) => {
        this.rateService.setRatables$(res.rateableList);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  checkIfRateAvailable(): void {
    const sub = this.rateService.getRatables$().subscribe({
      next: (ratables) => {
        if (!ratables?.length) {
          return;
        }
        const showRate = this.rateService.checkIfRateAvailable(this.store());
        const currentRatable: Rateable | null = this.rateService.getCurrentRatable();
        if (showRate) {
          this.bottomSheetService.openBottomSheet(RateBaseComponent, {
            storeImage: this.store()?.logoImageId ?? '',
            title: this.store()?.title ?? '',
            gateway: currentRatable?.purchase.activityPaymentChannel
          });
          const closeSub = this.bottomSheetService.onClose.subscribe(() => {
            const output = this.bottomSheetService.outputData();
            this.bottomSheetService.outputData.set(null);
            if (output && output.sentRate) {
              this.loadRateables();
            }
            closeSub.unsubscribe();
          });
        }
      }
    });
    this.subs.add(sub);
  }

  getTrackingCode(): void {
    this.trackingCode.set(decodeURI(this.activatedRoute.snapshot.paramMap.get('trackingCode') as string));
  }

  getStore(titleMode = false): void {
    const restriction = titleMode ? StoreRestrictionFields.TITLE : StoreRestrictionFields.TRACKING_CODE;
    this.storeApi.getStore(this.trackingCode()!, restriction).subscribe({
      next: (store) => {
        if (!store) {
          if (!titleMode) {
            this.getStore(true);
          } else {
            this.router.navigate(['/stores']).then();
          }
        } else {
          this.store.set(store);
          this.recentlyViewedService.addRecentlyViewedStore(store);
          this.trackingCode.set(store.trackingCode);
          this.getBanners();
          this.getVouchers();
          this.getStoreBranches();
          this.checkIfRateAvailable();
          this.triggerEvents();
          if (titleMode) {
            this.replaceUrlWithTrackingCode(store.trackingCode);
          }
        }
      }
    });
  }

  replaceUrlWithTrackingCode(trackingCode: string): void {
    this.router.navigate(['stores', trackingCode], {
      replaceUrl: true,
      queryParams: this.activatedRoute.snapshot.queryParams
    });
  }

  triggerEvents() {
    this.eventManagementService.triggerEvent({
      eventType: 'pageView',
      data: {
        url: window.location.pathname
      },
      meta: `storeType:${this.store()?.types.includes(StoreType.ONSITE) ? 'onsite' : 'online'}`,
      breadCrumbs: ['stores-detail', this.store()?.types.includes(StoreType.ONSITE) ? 'onsite' : 'online']
    });
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  isExpired(expirationTime: number): boolean {
    const now = Date.now();
    return expirationTime <= now;
  }

  goToWebsiteLanding(): void {
    this.actionHandler.handleExternalAction('https://www.mydigipay.com/credit/entekhab/');
  }

  getBanners(): void {
    this.bannerApiService.getBanners(false, 'STORE_DETAIL', this.trackingCode()).subscribe({
      next: (res) => {
        this.storeBanner.set(res.banners);
      },
      error: (err) => this.messageService.showErrorOfErrorResponse(err)
    });
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
    this.subs.unsubscribe();
    this.rateService.destroy();
  }
}
