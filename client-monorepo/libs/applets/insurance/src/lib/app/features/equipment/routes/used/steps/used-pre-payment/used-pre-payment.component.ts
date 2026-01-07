import { Component, EventEmitter, inject, input, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import moment from 'jalali-moment';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { UsedStepsListModel } from '../../partials/used-steps-list/models/used-steps-list.model';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { containsNonNumericCharacters } from '../../../../../../util/strings';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { UsedPrePaymentDetailComponent } from './partials/used-pre-payment-detail/used-pre-payment-detail.component';
import { UsedHeaderButtonModes } from '../../partials/used-header/models/used-header-button.modes';
import { AppWindow } from '../../../../../../data-access/web-interfaces/app-window';
import { UsedGetDiscountCodeComponent } from './partials/used-get-discount-code/used-get-discount-code.component';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import {
  UsedDevicePaymentInfoComponent
} from '../../partials/device-model-price-info/used-device-payment-info.component';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { PayRequestBodyModel } from '../../../../api/models/renewal/pay-request-body.model';
import { UsedDeviceInfoService } from '../used-device-info/services/used-device-info.service';
import { LoggedInUser } from '../../../../../../data-access/models/logged-in-user.model';
import { ReserveModel } from '../../../../api/models/renewal/reserve.model';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import { UsedJourneyService } from '../../../../../../data-access/services/user-services/used-journey.service';
import { FaqService } from '../../../../../../data-access/services/faq.service';
import { FaqCategoryTypeEnum } from '../../../../../../data-access/enums/faq-category-type.enum';
import { AuthService } from '@client-monorepo/common/user';
import { LoginService } from '../../../../../../data-access/services/user-services/login.service';

declare const window: AppWindow;

@Component({
  selector: 'used-pre-payment',
  templateUrl: './used-pre-payment.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    PipesModule,
    JourneyButtonsComponent,
    UsedDevicePaymentInfoComponent,
    UiButtonComponent,
    UiLoadingSpinnerComponent,
    NgTemplateOutlet,
  ],
  styleUrls: ['./used-pre-payment.component.scss'],
})
export class UsedPrePaymentComponent implements OnInit, OnDestroy {
  private readonly AUTO_PAY_REQUEST_QUERY_KEY: string = 'auto-pay';

  @Input()
  journey: JourneyNamesModel;
  // Subscription
  subscription: Subscription = new Subscription();
  loading$: Observable<boolean> = this.loadingService.getLoading();
  // Vars
  prePaymentData: OrderModel;
  firstColumnData: UsedStepsListModel[];
  secondListData: UsedStepsListModel[];
  isMobile = isMobileOrTablet() || !isDesktop();
  step: string;
  isHybrid: boolean;
  isRequesting: boolean;
  discountCode: string;
  isFromWebApp = this.sharedService.getIsUserFromWebAppValue();
  userInfo: LoggedInUser;
  private faqService = inject(FaqService);
  uniqueCode = input<string>();
  isSubmitting = signal<boolean>(false);

  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private messageService: MessageService,
    private sheet: MatBottomSheet,
    private intrackService: IntrackService,
    private apiService: UsedApiService,
    private loadingService: LoadingService,
    private ngxHybridService: NgxHybridServiceService,
    private sharedService: SharedUsedService,
    private deviceInfoService: UsedDeviceInfoService,
    private referrerService: ReferrerService,
  ) {
  }

  private authService = inject(AuthService);
  private usedJourneyService = inject(UsedJourneyService);
  private loginService = inject(LoginService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.sharedService.setJourney(this.journey);
    this.setHeaderData();
    this.getOrderInfo();
    this.getStep();
    this.subscribeToBackBtn();
    this.detectNativeApp();
    this.autoPayRequest();
    if (this.isFromWebApp || this.ngxHybridService.isHybrid()) {
      this.subscribeToUserInfo();
    }
  }

  autoPayRequest(): void {
    const params = {...this.activatedRoute.snapshot.queryParams};
    if (params[this.AUTO_PAY_REQUEST_QUERY_KEY]) {
      delete params[this.AUTO_PAY_REQUEST_QUERY_KEY];
      this.router.navigate([], {
        queryParams: {
          ...params
        },
        replaceUrl: true
      }).then(() => this.payRequest());
    }
  }

  detectNativeApp(): void {
    this.isHybrid = this.ngxHybridService.isHybrid();
  }

  subscribeToBackBtn(): void {
    const subscription = this.sharedService.getBackClick().subscribe({
      next: () => {
        this.sharedService.setStepChangeSubject('PREVIOUS');
      },
    });
    this.subscription.add(subscription);
  }

  setHeaderData(): void {
    this.sharedService.setHeaderData({
      showBackBtn: true,
      headerTitle: 'جزئیات پرداخت',
      actionButtons: [
        {
          mode: UsedHeaderButtonModes.CUSTOM_BUTTON,
          text: '',
          icon: 'assets/icons/info-border-circle.svg',
          clickHandler: () => {
            this.sheet.open(UsedPrePaymentDetailComponent, {
              data: this.prePaymentData.coverages,
              panelClass: 'bottom-sheet',
            });
          },
        },
      ],
    });
  }

  getStep(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params.step) {
      this.step = params.step;
    }
  }

  getOrderInfo(): void {
    const subscription = this.apiService
      .getOrderInfo(this.uniqueCode())
      .pipe(tap(() => this.hasError.emit(false)))
      .subscribe({
        next: (res) => {
          this.prePaymentData = this.convertToToman(res.data);
          this.generateColumnsData();
          if (this.prePaymentData.discountCode) {
            this.discountCode = this.prePaymentData.discountCode;
          }
          this.loadingService.setLoading(false);
        },
        error: (e) => {
          this.hasError.emit(true);
        },
      });
    this.subscription.add(subscription);
  }

  convertToToman(res: OrderModel): OrderModel {
    const pricingKeys: string[] = [
      'wageAmount',
      'taxAmount',
      'discountAmount',
      'payableAmount',
      'announcedPrice',
      'discountValue',
      'taxAmount',
      'totalAmount',
    ];
    for (const key in res) {
      if (pricingKeys.includes(key)) {
        res[key] = res[key] / 10;
      }
    }
    return res;
  }

  generateColumnsData(): void {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      this.firstColumnData = [
        {
          name: 'مدت تمدید',
          value: this.prePaymentData?.durationValue + ' ' + this.prePaymentData?.durationUnit,
          isPrice: false,
        },
        {
          name: 'پایان اعتبار',
          value: moment(this.prePaymentData?.policyExpiredAt).locale('fa').format('YYYY/MM/DD'),
          isPrice: false,
        },
        {
          name: 'ارزش حدودی دستگاه',
          value: this.generateDisplayPrice(this.prePaymentData?.displayPrice),
          isPrice: !containsNonNumericCharacters(this.prePaymentData?.displayPrice),
        },
      ];
    } else {
      this.secondListData = [
        {
          name: 'مدت اعتبار بیمه',
          value: this.prePaymentData?.durationValue + ' ' + this.prePaymentData?.durationUnit,
          isPrice: false,
        },
        {
          name: 'میزان حق بیمه',
          value: this.prePaymentData?.wageAmount + ' تومان',
          isPrice: true,
        },
        {
          name: 'مالیات بر ارزش افزوده',
          value: this.prePaymentData?.taxAmount + ' تومان',
          isPrice: true,
        },
        {
          name: 'میزان تخفیف',
          value: this.prePaymentData?.discountAmount + ' تومان',
          isPrice: true,
        },
      ];
    }
  }

  generateDisplayPrice(displayPrice: string): string {
    if (containsNonNumericCharacters(displayPrice)) {
      return displayPrice;
    } else {
      return String(Number(displayPrice) / 10) + ' تومان';
    }
  }

  payRequest(): void {
    this.isRequesting = true;
    this.sharedService.saveUniqueCodeInLS(this.uniqueCode());
    const body: PayRequestBodyModel = {
      code: this.uniqueCode(),
      step: this.step ? Number(this.step) : null,
      isRequestedByDesktop: !this.isMobile,
      isHybrid: this.isHybrid,
      referer: this.referrerService.referrer,
    };
    const subscription = this.apiService.payRequest(body).subscribe({
      next: (res) => {
        this.intrackService.sendIntrackEvent('I_CP', {
          DeviceModel: this.prePaymentData.productModel ?? '',
          DeviceBrand: this.prePaymentData.productBrand ?? '',
          DevicePrice: this.prePaymentData.announcedPrice ?? 0,
          TotalAmountPaid: this.prePaymentData.payableAmount ?? 0,
          VoucherUsed: !!this.prePaymentData.voucherId,
          uniquecode: this.uniqueCode() ?? '',
          State: 'SUCCESS',
          salesChannel: this.referrerService?.referrer ?? 'ads',
        });
        window.location.href = res.data.payUrl;
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.intrackService.sendIntrackEvent('I_CP', {
          DeviceModel: this.prePaymentData.productModel ?? '',
          DeviceBrand: this.prePaymentData.productBrand ?? '',
          DevicePrice: this.prePaymentData.announcedPrice ?? 0,
          TotalAmountPaid: this.prePaymentData.payableAmount ?? 0,
          VoucherUsed: !!this.prePaymentData.voucherId,
          uniquecode: this.uniqueCode() ?? '',
          State: 'FAILED',
          ErrorMessage: e.message ?? '',
          salesChannel: this.referrerService?.referrer ?? 'ads',
        });
        this.isRequesting = false;
      },
    });
    this.subscription.add(subscription);
  }

  handleGoToNextStep(): void {
    if (this.prePaymentData?.isUpgEnabled) {
      if (this.authService.isLoggedIn()) {
        this.payRequest();
      } else {
        this.loginService.routeToLoginPage(window.location.href.replace(window.location.origin, '') + '&auto-pay=true');
      }
    } else {
      this.payRequest();
    }
  }

  goToPreviousStep(): void {
    this.sharedService.setStepChangeSubject('PREVIOUS');
  }

  showDiscountBottomSheet(): void {
    this.sheet
      .open(UsedGetDiscountCodeComponent, {
        data: {
          uniqueCode: this.uniqueCode(),
        },
      })
      .afterDismissed()
      .subscribe((response: { prePaymentData?: ReserveModel; discount?: string }) => {
        if (response) {
          this.discountCode = response.discount;
          this.prePaymentData = {
            ...this.prePaymentData,
            ...response.prePaymentData,
          };
          this.generateColumnsData();
        } else {
          this.discountCode = null;
        }
        this.scrollToTop();
      });
  }

  reverseDiscount(): void {
    if (!this.isSubmitting()) {
      this.isSubmitting.set(true);
      const voucherCode = this.discountCode;
      if (voucherCode && voucherCode !== '') {
        const subscription = this.apiService
          .reverseDiscount(this.uniqueCode())
          .pipe(finalize(() => this.isSubmitting.set(false)))
          .subscribe({
            next: (res) => {
              this.prePaymentData = this.convertToToman(res.data);
              this.generateColumnsData();
              this.discountCode = null;
            },
            error: (e) => {
              this.messageService.showErrorIfExists(e);
            },
          });
        this.subscription.add(subscription);
      }
    }
  }

  subscribeToUserInfo(): void {
    this.loadingService.setLoading(true);
    const subscription = this.sharedService.getUserInfo().subscribe({
      next: (info) => {
        this.userInfo = info;
        if (this.userInfo) {
          this.deviceInfoService.setStoredDeviceInfo({
            ...this.deviceInfoService.getStoredDeviceInfo(),
            phoneNumber: this.userInfo.cellNumber,
          });
        }
        this.loadingService.setLoading(false);
      },
    });
    this.subscription.add(subscription);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  public openConditionTerms(): void {
    this.faqService.open(FaqCategoryTypeEnum.EQUIPMENT);
  }

  ngOnDestroy(): void {
    this.usedJourneyService.purgeJourneyUserId();
    this.loadingService.setLoading(false);
    this.subscription.unsubscribe();
  }
}
