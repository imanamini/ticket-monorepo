import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import moment from 'jalali-moment';
import { ActivatedRoute } from '@angular/router';
import { AppWindow } from '../../../../../../data-access/web-interfaces/app-window';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthService } from '../../../../../auth/service/auth.service';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { RenewalStepsListModel } from '../../partials/renewal-steps-list/models/renewal-steps-list.model';
import { containsNonNumericCharacters } from '../../../../../../util/strings';
import { finalize } from 'rxjs/operators';
import { CheckAuthBodyModel } from '../../../../../auth/models/check-auth-body.model';
import { JourneyOtpComponent } from '../../../../partials/journey-otp/journey-otp.component';
import { CoveragesComponent } from '../../../../partials/coverages/coverages.component';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { RenewalStepsListComponent } from '../../partials/renewal-steps-list/renewal-steps-list.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { DiscountReserveBody } from '../../../../api/models/renewal/discount-reserve-body.model';
import { PayRequestBodyModel } from '../../../../api/models/renewal/pay-request-body.model';
import { LoginService } from '../../../../../../data-access/services/user-services/login.service';
import { PinService } from '../../../../../../data-access/services/user-services/pin.service';
import { UsedJourneyService } from '../../../../../../data-access/services/user-services/used-journey.service';
import { SharedUserSourceService } from '../../../../../../data-access/services/user-services/shared-user-source.service';

declare const window: AppWindow;

@Component({
  selector: 'renewal-pre-payment',
  templateUrl: './renewal-pre-payment.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RenewalStepsListComponent,
    UiFormFieldBuilderModule,
    FormsModule,
    PipesModule,
    JourneyButtonsComponent,
    AsyncPipe,
  ],
  styleUrls: ['./renewal-pre-payment.component.scss'],
})
export class RenewalPrePaymentComponent implements OnInit, OnDestroy {
  constructor() {}

  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private sheet = inject(MatBottomSheet);
  private authApi = inject(AuthService);
  private service = inject(SharedRenewalService);
  private apiService = inject(RenewalApiService);
  private loadingService = inject(LoadingService);
  private loginService = inject(LoginService);
  private pinService = inject(PinService);
  private usedJourneyService = inject(UsedJourneyService);
  private sharedUserSourceService = inject(SharedUserSourceService);

  @Input()
  journey: JourneyNamesModel;

  // Subscription
  subscriptions: Subscription[] = [];
  loading$: Observable<boolean> = this.loadingService.getLoading();

  // Vars
  uniqueCode: string;
  prePaymentData: OrderModel;
  firstColumnData: RenewalStepsListModel[];
  secondColumnData: RenewalStepsListModel[];
  voucherCode: string;
  isVoucherSubmitted: boolean;
  isMobile = isMobileOrTablet() || !isDesktop();
  step: string;

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.getUniqueCode();
    this.getStep();
  }

  getStep(): void {
    const params = this.route.snapshot.queryParams;
    if (params.step) {
      this.step = params.step;
    }
  }

  getUniqueCode(): void {
    this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
  }

  getOrderInfo(): void {
    const subscription = this.apiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.prePaymentData = res.data;
        this.generateColumnsData();
        if (this.prePaymentData.discountCode) {
          this.voucherCode = this.prePaymentData.discountCode;
        }
        if (this.prePaymentData.discountAmount) {
          this.isVoucherSubmitted = true;
        }
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
    this.subscriptions.push(subscription);
  }

  generateColumnsData(): void {
    this.firstColumnData = [
      {
        name: 'مدت تمدید',
        value: this.prePaymentData.durationValue + ' ' + this.prePaymentData.durationUnit,
        isPrice: false,
      },
      {
        name: 'پایان اعتبار',
        value: moment(this.prePaymentData.policyExpiredAt).locale('fa').format('YYYY/MM/DD'),
        isPrice: false,
      },
      {
        name: 'ارزش حدودی دستگاه',
        value:
          this.prePaymentData.displayPrice +
          String(containsNonNumericCharacters(this.prePaymentData.displayPrice) ? ' میلیون تومان' : ' تومان'),
        isPrice: !containsNonNumericCharacters(this.prePaymentData.displayPrice),
      },
    ];

    this.secondColumnData = [
      {
        name: 'میزان حق بیمه:',
        value: this.prePaymentData.wageAmount / 10 + ' تومان',
        isPrice: true,
      },
      {
        name: 'مالیات بر ارزش افزوده:',
        value: this.prePaymentData.taxAmount / 10 + ' تومان',
        isPrice: true,
      },
      {
        name: 'میزان تخفیف:',
        value: this.prePaymentData.discountAmount / 10 + ' تومان',
        isPrice: true,
      },
    ];
    this.prePaymentData = {
      ...this.prePaymentData,
      payableAmount: this.prePaymentData.payableAmount / 10,
    };
  }

  reserveDiscount(): void {
    this.loadingService.setLoading(true);
    const body: DiscountReserveBody = {
      key: this.uniqueCode,
      discountCode: this.voucherCode,
    };
    const subscription = this.apiService
      .reserveDiscount(body)
      .pipe(finalize(() => this.loadingService.setLoading(false)))
      .subscribe({
        next: (res) => {
          if (res.data.isValid) {
            this.prePaymentData = {
              ...this.prePaymentData,
              discountAmount: res.data.discountAmount,
              payableAmount: res.data.payableAmount,
            };
            this.isVoucherSubmitted = true;
            this.generateColumnsData();
          } else {
            this.messageService.showErrorMessage(res.data.invalidMessage);
          }
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
          this.isVoucherSubmitted = false;
        },
      });
    this.subscriptions.push(subscription);
  }

  reverseDiscount(): void {
    this.loadingService.setLoading(true);
    this.voucherCode = this.voucherCode.trim();
    if (this.voucherCode && this.voucherCode !== '') {
      const subscription = this.apiService
        .reverseDiscount(this.uniqueCode)
        .pipe(finalize(() => this.loadingService.setLoading(false)))
        .subscribe({
          next: (res) => {
            this.prePaymentData = res.data;
            this.isVoucherSubmitted = false;
            this.generateColumnsData();
          },
          error: (e) => {
            this.messageService.showErrorIfExists(e);
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  payRequest(): void {
    this.loadingService.setLoading(true);
    this.service.saveUniqueCodeInLS(this.uniqueCode);
    const body: PayRequestBodyModel = {
      code: this.uniqueCode,
      step: this.step ? Number(this.step) : null,
      isRequestedByDesktop: !this.isMobile,
      isHybrid: !!window.digipayHybridApp,
    };
    const subscription = this.apiService
      .payRequest(body)
      .pipe(finalize(() => this.loadingService.setLoading(false)))
      .subscribe({
        next: (res) => {
          window.location.href = res.data.payUrl;
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
        },
      });
    this.subscriptions.push(subscription);
  }

  handleGoToNextStep(): void {
    if (this.prePaymentData.isUpgEnabled) {
      if (this.loginService.isLoggedIn) {
        const body: CheckAuthBodyModel = {
          mobile: this.prePaymentData.mobile,
          uniqueCode: this.uniqueCode ? this.uniqueCode : null,
        };
        const subscription = this.authApi.checkAuth(body).subscribe({
          next: (res) => {
            if (res.data.isAuthenticated) {
              this.payRequest();
            } else {
              this.showOtpPopup();
            }
          },
          error: (e) => {
            console.error(e);
          },
        });
        this.subscriptions.push(subscription);
      } else {
        this.showOtpPopup();
      }
    } else {
      this.payRequest();
    }
  }

  showOtpPopup(): void {
    if (this.isMobile) {
      const refDialog = this.sheet.open(JourneyOtpComponent, {
        data: {
          mobile: this.prePaymentData.mobile,
        },
        autoFocus: true,
      });
      const subscription = refDialog.afterDismissed().subscribe({
        next: (res) => {
          if (res?.isAccepted) {
            this.payRequest();
          } else {
            this.subscribeOnCheckPin();
          }
        },
      });
      this.subscriptions.push(subscription);
    } else {
      const refDialog = this.dialog.open(JourneyOtpComponent, {
        width: '600px',
        data: {
          mobile: this.prePaymentData.mobile,
        },
      });
      const subscription = this.loginService.isLoggedIn$.subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            this.payRequest();
          }
        },
      });
      this.subscriptions.push(subscription);
      const subscriptionTwo = this.sharedUserSourceService.userHasPassword.asObservable().subscribe((hasPassword) => {
        if (hasPassword) {
          this.subscribeOnCheckPin();
        }
      });
      this.subscriptions.push(subscriptionTwo);
    }
  }

  subscribeOnCheckPin(): void {
    const subscription = this.pinService.getCheckPinResolveSubject().subscribe({
      next: (res) => {
        if (res) {
          this.payRequest();
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  showCoverages(): void {
    const refDialog = this.dialog.open(CoveragesComponent, {
      width: '600px',
      data: {
        coverages: this.prePaymentData.coverages,
      },
    });
    refDialog.afterClosed().subscribe({
      next: () => {},
    });
  }

  goToPreviousStep(): void {
    this.service.setStepChangeSubject('PREVIOUS');
  }

  ngOnDestroy(): void {
    this.usedJourneyService.purgeJourneyUserId();
    this.loadingService.setLoading(false);
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
