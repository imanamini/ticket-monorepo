import {
  Component,
  inject,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DOCUMENT, Location, NgClass } from '@angular/common';
import { Observable, Subscription, tap } from 'rxjs';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { UsedApiService } from '../../../api/services/used/used-api.service';
import { JourneyNamesModel } from '../../../shared-steps/models/journey-names.model';
import { StepStates } from '../../renewal/partials/renewal-stepper/models/step-states';
import { AppWindow } from '../../../../../data-access/web-interfaces/app-window';
import { LoggedInUser } from '../../../../../data-access/models/logged-in-user.model';
import { UsedHeaderButtonModes } from '../partials/used-header/models/used-header-button.modes';
import { UsedHeaderDataModel } from '../partials/used-header/models/used-header-data.model';
import { KeyboardService } from '../../../shared-steps/services/keyboard.service';
import { SharedUsedService } from '../services/shared-used.service';
import {
  JourneyActionResultDataModel
} from '../../../partials/journey-action-result/models/journey-action-result-data.model';
import { UsedDeviceInfoComponent } from '../steps/used-device-info/used-device-info.component';
import { UsedPricingComponent } from '../steps/used-pricing/used-pricing.component';
import { UsedPrePaymentComponent } from '../steps/used-pre-payment/used-pre-payment.component';
import {
  UsedCompleteInformationComponent
} from '../steps/used-complete-information/used-complete-information.component';
import {
  UsedCompleteInformationResultComponent
} from '../steps/used-complete-information-result/used-complete-information-result.component';
import { UsedIssuePolicyComponent } from '../steps/used-issue-policy/used-issue-policy.component';
import { UsedPaymentResultComponent } from '../steps/used-payment-result/used-payment-result.component';
import { HealthCheckComponent } from '../../../shared-steps/health-check/health-check.component';
import { JourneyActionResultComponent } from '../../../partials/journey-action-result/journey-action-result.component';
import { UsedHeaderComponent } from '../partials/used-header/used-header.component';
import { LocationTrapComponent } from '../../../../../components/location-trap/location-trap.component';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { UsedUploadFileComponent } from '../steps/used-upload-file/used-upload-file.component';
import { StateModel } from '../../../api/models/renewal/state.model';
import { ConfigAppService } from '../../../../../data-access/services/config-app.service';
import { CampaignCalculationsService } from '../steps/used-pricing/services/campaign-calculations.service';
import { DiscountCampaignModel } from '../../../api/models/used/discount-campaign.model';
import { IntrackService } from '../../../../../data-access/services/intrack.service';
import { UiLoadingSpinnerComponent } from '../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { DpxService } from '../../../../../data-access/services/dpx.service';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { LoginService } from '../../../../../data-access/services/user-services/login.service';
import { UrlService } from '../../../../../data-access/services/url.service';
import { UserApiService } from '../../../../../data-access/services/user/user-api.service';
import { UiButtonComponent } from '../../../../../components/ui-button/ui-button/ui-button.component';
import { NavigationService } from '../../../../../data-access/services/navigation.service';
import { AuthService } from '@client-monorepo/common/user';
import { CloseService } from '../../../../vehicle/data-access/services/shared/close.service';

declare const window: AppWindow;

@Component({
  selector: 'used-device-layout',
  templateUrl: './used-layout.component.html',
  standalone: true,
  styleUrls: ['./used-layout.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    UsedDeviceInfoComponent,
    UsedPricingComponent,
    UsedPrePaymentComponent,
    UsedCompleteInformationComponent,
    UsedCompleteInformationResultComponent,
    UsedIssuePolicyComponent,
    UsedPaymentResultComponent,
    HealthCheckComponent,
    JourneyActionResultComponent,
    UsedHeaderComponent,
    LocationTrapComponent,
    UsedUploadFileComponent,
    UiLoadingSpinnerComponent,
    UiButtonComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class UsedLayoutComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private renderer: Renderer2,
    private sharedService: SharedUsedService,
    private keyboardService: KeyboardService,
    private usedApiService: UsedApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxHybridServiceService: NgxHybridServiceService,
    private ngZone: NgZone,
    private messageService: MessageService,
    private configAppService: ConfigAppService,
    private campaignCalculationsService: CampaignCalculationsService,
    private intrackService: IntrackService,
    private dpxService: DpxService,
    private refererService: ReferrerService,
  ) {
  }

  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private urlService = inject(UrlService);
  private userApiService = inject(UserApiService);
  private navigationService = inject(NavigationService);
  private closeService = inject(CloseService);

  readonly JourneyNamesModel = JourneyNamesModel;
  subscriptions: Subscription = new Subscription();
  isMobile = false;
  showHealthCheck = false;
  showPaymentResult = false;
  uniqueCode: string;
  stateData: StateModel[];
  activeStepIndex = 0;
  state$: Observable<StateModel[]>;
  actionResultData: JourneyActionResultDataModel;
  headerData$: Observable<UsedHeaderDataModel>;
  isHybridApp: boolean;
  url: string;
  uploadUrl = signal<string>('digipay/api/insurance/claim/upload');
  uploadCardTitle = signal<string>('تصویر صفحه نمایش اول');
  // it was like this: showOnBoarding = !localStorage.getItem(this.sharedService.usedOnBoardingKey);
  // It is set to false because temporarily we don't want to show the Onboarding features
  showOnBoarding = false;
  campaignDiscount = signal<DiscountCampaignModel | null>(null);
  isLoading = signal<boolean>(true);
  errorPageText = signal<string | null>(null);
  canBack = signal<boolean>(false);

  ngOnInit(): void {
    const body = this.document.body;
    this.renderer.setStyle(body, 'overflow-x', 'hidden');
    this.url = this.router.url;
    this.getDiscountCampaign();
    this.isMobile = isMobileOrTablet() || !isDesktop();
    if (!this.isMobile) {
      this.generateActionResultData();
    }
    if (this.authService.isLoggedIn()) {
      this.configAppService.getConfig().subscribe((z) => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  init(): void {
    this.sharedService.setJourney(JourneyNamesModel.USED_DEVICE);
    this.subscribeToKeyboardVisibility();
    this.getUrlParams();
    this.getUniqueCode();
    this.getShowHealthCheck();
    this.subscribeToStepChange();
    this.subscribeToActiveIndex();
    this.subscribeToGetState();
    this.subscribeToHeaderData();
  }

  getUrlParams(): void {
    const code = this.sharedService.getUniqueCodeValue();
    const params = this.route.snapshot.queryParams;
    // TODO: remove it after deprecated native app
    const isFromNativeApp = typeof window.DigipayJsInterface !== 'undefined';
    this.isHybridApp = this.ngxHybridServiceService.isHybrid();
    this.sharedService.setIsUserFromNativeApp(isFromNativeApp);

    // Token Processing
    if (this.loginService.isLoggedIn && !isFromNativeApp) {
      this.getUserProfile();
    } else if (isFromNativeApp) {
      this.intrackService.sendIntrackEvent('I_SB');
      // this.communicationApproach();
      this.isLoading.set(false);
    } else {
      this.isLoading.set(false);
    }

    this.sharedService.setIsUserFromWebApp(this.dpxService.IsEnteredFromDpx);
    // Unique Code
    if (params.code) {
      this.uniqueCode = params.code;
      if (!code || (code && this.uniqueCode !== code)) {
        this.sharedService.setUniqueCode(this.uniqueCode);
        this.getUsedState();
      }
    } else if (!params.code) {
      this.fillMockStateData();
    }

    // Provider Id
    if (params.providerId) {
      this.sharedService.setProviderId(params.providerId);
      this.showPaymentResult = true;
    } else if (!params.providerId) {
      this.sharedService.setProviderId(null);
      this.showPaymentResult = false;
    }
  }

  getDiscountCampaign(): void {
    const subscription = this.campaignCalculationsService.getCampaignDiscount().subscribe({
      next: (res) => {
        this.campaignDiscount.set(res);
      },
    });
    this.subscriptions.add(subscription);
  }

  /*
   * User Data **/
  getUserProfile(): void {
    // remember this request to redirect to
    // it after a successful login
    this.urlService.storeTheRequestedUrl();
    setTimeout(() => {
      const subscription = this.userApiService.getUserProfile().subscribe({
        next: (res) => {
          this.saveUserInfo(res.userDetail);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.messageService.showErrorIfExists(err);
        },
      });
      this.subscriptions.add(subscription);
    }, 1000);
  }

  saveUserInfo(info: LoggedInUser): void {
    this.sharedService.setUserInfo(info);
  }

  getUniqueCode(): void {
    const subscription = this.sharedService.getUniqueCode().subscribe({
      next: (code) => {
        if (!this.uniqueCode || code !== this.uniqueCode) {
          this.uniqueCode = code;
          this.addCodeToUrl();
        }
      },
    });
    this.subscriptions.add(subscription);
  }

  addCodeToUrl(): void {
    this.router
      .navigate([], {
        relativeTo: this.route,
        replaceUrl: false,
        queryParams: {
          code: this.uniqueCode,
          referrer: this.refererService.referrer,
        },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  subscribeToStepChange(): void {
    const subscription = this.sharedService.getStepChangeSubject().subscribe({
      next: (data) => {
        switch (data) {
          case 'NEXT':
            this.getUsedState();
            break;
          case 'PREVIOUS':
            const state = this.stateData[this.activeStepIndex]?.state;
            const inactiveSteps = [5, 1];
            if (!inactiveSteps.includes(state)) {
              if (state <= 3 && state > 0) {
                this.activeStepIndex = this.activeStepIndex - 1;
                this.sharedService.setActiveIndex(this.activeStepIndex);
              }
            }
            break;
        }
      },
    });
    this.subscriptions.add(subscription);
  }

  subscribeToActiveIndex(): void {
    const subscription = this.sharedService.getActiveIndex().subscribe({
      next: (index) => {
        if (index !== this.activeStepIndex) {
          this.activeStepIndex = index;
        }
      },
    });
    this.subscriptions.add(subscription);
  }

  getShowHealthCheck(): void {
    const subscription = this.sharedService.getShowHealthCheckSubject().subscribe({
      next: (val) => {
        this.showHealthCheck = val;
      },
    });
    this.subscriptions.add(subscription);
  }

  getUsedState(): void {
    const subscription = this.usedApiService
      .getState(this.uniqueCode)
      .pipe(
        tap(() => {
          this.errorPageText.set(null);
          this.canBack.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.sharedService.setStateData(res.data);
          this.checkHealthCheckDone();
          this.errorPageText.set(null);
        },
        error: (e) => {
          this.canBack.set(true);
          this.errorPageText.set(e.error.result.message || e.error.message || 'خطا در دریافت اطلاعات');
        },
      });
    this.subscriptions.add(subscription);
  }

  subscribeToGetState(): void {
    this.state$ = this.sharedService.getStateData();
    const subscription = this.sharedService.getStateData().subscribe({
      next: (data) => {
        this.stateData = data;

        //   This part of code was in RenewalStepperComponent,
        //   but the component is not here anymore and we needed this functionality
        let activeStepIndex = 0;
        this.stateData?.map((item, index) => {
          if (item?.stepState === StepStates.COMPLETED) {
            if (index !== this.stateData.length - 1) {
              activeStepIndex = index + 1;
            } else {
              activeStepIndex = index;
            }
          }
          this.sharedService.setActiveIndex(activeStepIndex);
        });
      },
    });
    this.subscriptions.add(subscription);
  }

  fillMockStateData(): void {
    this.sharedService.setStateData([
      {
        stepState: 1,
        state: 1,
        title: 'اطلاعات بیمه',
      },
      {
        stepState: 0,
        state: 2,
        title: 'ارزش گذاری',
      },
      {
        stepState: 0,
        state: 3,
        title: 'پرداخت',
      },
      {
        stepState: 0,
        state: 4,
        title: 'سلامت سنجی',
      },
      {
        stepState: 0,
        state: 5,
        title: 'تکمیل اطلاعات',
      },
      {
        stepState: 0,
        state: 6,
        title: 'آپلود تصویر',
      },
      {
        stepState: 0,
        state: 7,
        title: 'صدور بیمه نامه',
      },
    ]);
  }

  checkHealthCheckDone(): void {
    this.stateData.forEach((state) => {
      if (state.state > 5 && state.stepState > 0) {
        this.showPaymentResult = false;
        this.removeProviderIdFromUrl();
        return;
      }
    });
  }

  removeProviderIdFromUrl(): void {
    const queryParams = {...this.route.snapshot.queryParams};
    delete queryParams.providerId;
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: Object.assign({}, queryParams),
        replaceUrl: false,
      })
      .then();
  }

  generateActionResultData(): void {
    this.actionResultData = {
      title: 'لطفا با دستگاه موبایل مسیر را ادامه بدهید!',
      imageSrc: 'insurance-assets/images/renewal-failed-payment.svg',
      imageAlt: 'Please Use Mobile',
      actionButtonTitle: 'بازگشت به خانه',
    };
  }

  onBoardingFinished(isFinished: boolean): void {
    this.showOnBoarding = !isFinished;
  }

  subscribeToHeaderData(): void {
    this.headerData$ = this.sharedService.getHeaderData();
    this.sharedService.setHeaderData({
      showBackBtn: false,
      actionButtons: [{mode: UsedHeaderButtonModes.PROFILE}],
    });
  }

  showHeader(): boolean {
    if (this.sharedService.getShowHeaderValue()) {
      if (!this.showPaymentResult) {
        if (this.stateData[this.activeStepIndex]?.state === 6) {
          return false;
        } else if (this.stateData[this.activeStepIndex]?.state === 1) {
          return !this.showOnBoarding;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  scrollTo(x: number, y: number): void {
    this.renderer.setProperty(this.document.documentElement, 'scrollTop', x);
    this.renderer.setProperty(this.document.documentElement, 'scrollLeft', y);
    this.renderer.setProperty(this.document.body, 'scrollTop', x);
    this.renderer.setProperty(this.document.body, 'scrollLeft', y);
  }

  subscribeToKeyboardVisibility(): void {
    const subscription = this.keyboardService.getKeyboardVisibility().subscribe({
      next: (isVisible) => {
        if (!isVisible) {
          this.scrollTo(0, 0);
          window.scrollTo(0, 0);
        }
      },
    });
    this.subscriptions.add(subscription);
  }

  public goToBack(): void {
    this.location.back();
  }

  public hasError(status: boolean): void {
    this.canBack.set(status);
    this.errorPageText.set(status ? 'خطا در دریافت اطلاعات' : null);
  }

  goToHome(): void {
    this.closeService.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
