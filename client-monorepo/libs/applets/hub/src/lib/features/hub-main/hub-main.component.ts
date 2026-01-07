import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import {
  AbTestService,
  Banner,
  BannerCategory,
  DisasterLevelService,
  HeaderBackgroundDirective,
  InitiatorService,
  PerformanceTierService,
  StorageService,
} from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { AssetSectionComponent } from '@client-monorepo/common/user-assets';
import {
  CategorizedServiceItemInterface,
  InsideServiceComponentComponent,
  MainServicesPreviewComponent,
  PremiumServicesComponent,
  RecommendedBillTypeInterface,
} from '@client-monorepo/common/app-services';
import {
  AppService,
  AppServiceCategoryNamesEnum,
  appServicesCategoriesConst,
  AppServiceStatusEnum,
  FrequentServiceInterface,
} from '@client-monorepo/common/service-data';
import {
  BannersApiService,
  ChangeBannerDateTimeComponent,
  SharedCommonBannersComponent,
} from '@client-monorepo/libs/shared/common/banners';
import { UpcomingBillComponent } from '../../components/upcoming-bill/upcoming-bill.component';
import { InsideServiceData } from '../../data-access/constants/inside-service-data.const';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { InstallmentWidgetComponent, InstallmentWidgetDataService } from '@client-monorepo/common/installment';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgStyle } from '@angular/common';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { BillApiService, BillGeneralService } from '@client-monorepo/daily-fintech/bill';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WalkThroughService } from '@client-monorepo/shared/common/walk-through';
import { NgxDpPullToRefreshDirective } from '@digipay/ngx-dp-pull-to-refresh';
import { EventManagementService } from '@client-monorepo/common/event-management';
import {
  Message,
  MessageManagementMainComponent,
  MessageManagementService,
  MessagesResponse,
  MessageTypes,
  MessageViewEnum,
} from '@client-monorepo/shared/common';
import { NgxStatusLightComponent, StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@digipay/ngx-status-light';

import { filter, interval, take } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OfflineSheetOptionComponent } from '@client-monorepo/shared/common/offline-payment';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';
declare const window: any;

@Component({
  selector: 'hub-applet-main',
  standalone: true,
  imports: [
    DpIconComponent,
    HeaderBackgroundDirective,
    AssetSectionComponent,
    PremiumServicesComponent,
    MainServicesPreviewComponent,
    SharedCommonBannersComponent,
    InsideServiceComponentComponent,
    UpcomingBillComponent,
    InstallmentWidgetComponent,
    NgxSkeletonLoadingComponent,
    NgStyle,
    NgxDpPullToRefreshDirective,
    MessageManagementMainComponent,
    NgxStatusLightComponent,
    NgxRouterLoadingDirective,
  ],
  templateUrl: './hub-main.component.html',
  styleUrl: './hub-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainComponent implements OnInit, AfterViewInit, OnDestroy {
  // Injects
  private router = inject(Router);
  private appServiceService = inject(AppService);
  private bannersApiService = inject(BannersApiService);
  private actionHandlerService = inject(ActionHandlerService);
  private installmentWidgetService = inject(InstallmentWidgetDataService);
  private destroyRef = inject(DestroyRef);
  private initiatorService = inject(InitiatorService);
  private billApiService = inject(BillApiService);
  private billService = inject(BillGeneralService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private storageService = inject(StorageService);
  private walkThroughService = inject(WalkThroughService);
  private eventManagementService = inject(EventManagementService);
  private ngxBottomSheetService = inject(NgxBottomSheetService);
  messageManagementService = inject(MessageManagementService);
  disasterService = inject(DisasterLevelService);
  hideAssets = computed(() => this.disasterService.hideAssets());
  //signals
  bannersData = computed<Banner[]>(() => {
    return this.allBannersData().filter((banner) => {
      if (!banner.geoRestricted) {
        return true;
      }
      return this.geoEntitiesBanner()[banner.uuid];
    });
  });
  allBannersData = signal<Banner[]>([]);
  geoEntitiesBanner = signal<{ [key: string]: boolean }>({});
  services = signal<Array<FrequentServiceInterface>>([]);
  servicesLoading = signal(true);
  contentStyle = computed<{ [key: string]: any }>(() => {
    let padding = this.bottomNavigationService.reservedHeight();
    if (this.installmentWidgetService.penaltyMode()) {
      padding += 20 + 72;
    }
    return {
      'padding-bottom': `${padding}px`,
    };
  });
  billsLoading = signal<boolean>(true);
  recommendedBills = signal<Array<RecommendedBillTypeInterface>>([]);
  assetSectionElm = viewChild<AssetSectionComponent>('assetSection');
  installmentWidget = viewChild<InstallmentWidgetComponent>('installmentWidget');
  alertMessage = signal<Message | null>(null);
  performanceTierService = inject(PerformanceTierService);
  headerLimited = computed(() => this.performanceTierService.tier() === 'low');

  onScanClicked(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub'],
      data: {
        target: 'qr-scanner',
      },
    });
    this.ngxBottomSheetService.openBottomSheet(OfflineSheetOptionComponent, { resource: 'hub' });
  }

  ngOnInit() {
    this.bottomNavigationService.show();
    if (!this.initiatorService.initialized()) {
      this.initiatorService.initiate();
    }
    this.getAppServices();
    this.getBanners();
    this.getRecommendedBills();
  }

  private getMessages(isDeleteCache = false): void {
    this.messageManagementService
      .getMessages(isDeleteCache)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: MessagesResponse) => {
          const hasAlertMessage = result?.messages.find((msg: Message) => msg.type === MessageTypes.ALERT && !msg.isRead);
          if (hasAlertMessage && this.messageManagementService.shouldShowAlertMessage()) {
            this.checkSafeToShowMessage(hasAlertMessage);
          }
        },
      });
  }

  private checkSafeToShowMessage(message: Message): void {
    interval(500)
      .pipe(
        filter(() => !window.showSplash && !window.isGettingPassword && !this.walkThroughService.isWalkThroughVisible()),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          // Flag to prevent app update while the notice sheet is open
          window.popupMessage = true;
          this.alertMessage.set(message);
          this.messageManagementService.setAppMessageTimeStamp();
          this.storageService.setMessageApiCall();
          this.messageManagementService.markMessageAsRead(message?.messageId);
        },
      });
  }

  onMessageClicked(): void {
    if (AbTestService.canChangeBannerTime()) {
      this.ngxBottomSheetService.openBottomSheet(ChangeBannerDateTimeComponent, {});
      return;
    }
    this.router
      .navigate(['inbox'], {
        queryParams: {
          referer: 'hub',
        },
      })
      .then();
  }

  ngOnDestroy() {
    this.eventManagementService.sendEvents();
  }

  ngAfterViewInit() {
    this.getMessages();
  }

  private getAppServices(): void {
    this.appServiceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.services.set(result);
          this.servicesLoading.set(false);
        },
      });
  }
  private getBanners(): void {
    this.bannersApiService
      .getBanners()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.allBannersData.set(result.banners);
        },
      });
  }
  onInsideActionClicked(url: string): void {
    if (url) {
      this.eventManagementService.triggerEvent({
        eventType: 'click',
        breadCrumbs: ['hub'],
        data: {
          target: `inside-service-cta: ${url}`,
        },
      });
      this.router.navigateByUrl(url).then();
    }
  }
  onServiceClickAction(service: FrequentServiceInterface): void {
    const status = service.status;
    const isClickable = status !== this.AppServiceStatus.DISABLED && status !== this.AppServiceStatus.NO_ACTION;
    if (!isClickable) return;
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub'],
      data: {
        target: `service: ${service.title}`,
      },
    });
    this.actionHandlerService
      .handle({
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: service.id,
        },
      })
      .then();
  }

  getRecommendedBills(): void {
    this.billApiService
      .getRecommendedBillConfigs(7)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (billConfig) => {
          this.recommendedBills.set(billConfig);
          this.billsLoading.set(false);
        },
        error: () => {
          this.recommendedBills.set([]);
          this.billsLoading.set(false);
        },
      });
  }

  handleBill(bill: CategorizedServiceItemInterface): void {
    this.billService.recommendationClick(bill.data);
  }

  handleRefresh(): void {
    if (this.hideAssets()) {
      return;
    }
    this.assetSectionElm()?.refresh();
    this.installmentWidget()?.refresh();
    this.getMessages(true);
  }
  protected readonly appServicesCategoriesConst = appServicesCategoriesConst;
  protected readonly AppServiceCategoryNamesEnum = AppServiceCategoryNamesEnum;
  protected readonly BannerCategory = BannerCategory;
  protected readonly InsideServiceData = InsideServiceData;
  protected readonly AppServiceStatus = AppServiceStatusEnum;
  protected readonly MessageViewEnum = MessageViewEnum;
  protected readonly StatusLightSizesEnum = StatusLightSizesEnum;
  protected readonly StatusLightColorsEnum = StatusLightColorsEnum;
  protected readonly StatusLightBordersEnum = StatusLightBordersEnum;
}
