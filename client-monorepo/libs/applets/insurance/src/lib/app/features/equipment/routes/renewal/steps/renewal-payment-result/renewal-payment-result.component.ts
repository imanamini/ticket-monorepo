import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import {
  JourneyActionResultDataModel
} from '../../../../partials/journey-action-result/models/journey-action-result-data.model';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { OsNames } from '../../../../../../data-access/services/device/os-names';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import {
  JourneyActionResultComponent
} from '../../../../partials/journey-action-result/journey-action-result.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { PaymentResultModel } from '../../../../api/models/renewal/payment-result.model';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import {
  getBrowserName,
  getOsName,
  isDesktop,
  isMobileOrTablet,
  MessageService
} from '@client-monorepo/common/utilities';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'renewal-payment-result',
  templateUrl: './renewal-payment-result.component.html',
  standalone: true,
  imports: [NgIf, JourneyButtonsComponent, JourneyActionResultComponent, AsyncPipe, UiLoadingSpinnerComponent, UiButtonComponent],
  styleUrls: ['./renewal-payment-result.component.scss'],
})
export class RenewalPaymentResultComponent implements OnInit, OnDestroy {
  constructor(
    private service: SharedRenewalService,
    private apiService: RenewalApiService,
    private loadingService: LoadingService,
    private messageService: MessageService,
  ) {
  }

  @Input()
  journey: JourneyNamesModel;

  readonly JourneyNamesModel = JourneyNamesModel;
  loading$: Observable<boolean> = this.loadingService.getLoading();

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  isHealthCheckAvailable: boolean;
  providerId: string;
  uniqueCode: string;
  paymentResultData: PaymentResultModel;
  actionResultData: JourneyActionResultDataModel;
  orderInfo: OrderModel;
  isMobileOrTablet = isMobileOrTablet() || !isDesktop();
  productCategory: ProductCategoryModel;
  osName: OsNames;
  isDesktop = isDesktop();
  browserName = getBrowserName();

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.osName = OsNames[getOsName()];
    this.getProviderId();
  }

  getProviderId(): void {
    const subscription = this.service.getProviderId().subscribe({
      next: (id) => {
        this.providerId = id;
        if (this.providerId && this.providerId !== '0') {
          this.getPaymentResult();
        } else if (this.providerId && this.providerId === '0') {
          this.getUniqueCodeFromLs();
          this.generateActionResultData(false);
        } else {
          this.getUniqueCode();
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  getUniqueCode(): void {
    const subscription = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code !== this.uniqueCode) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  getUniqueCodeFromLs(): void {
    const code = this.service.getUniqueCodeFromLS();
    if (code !== this.uniqueCode) {
      this.uniqueCode = code;
      this.getOrderInfo();
    }
  }

  getOrderInfo(): void {
    this.loadingService.setLoading(true);
    const subscription = this.apiService.getOrderInfo(this.uniqueCode).subscribe({
      next: (res) => {
        this.orderInfo = res.data;
        this.productCategory = ProductCategoryModel[res.data.productCategory];
        if (res.data.paymentResultUrl) {
          this.providerId = res.data.paymentResultUrl.split('=')[1];
          this.getPaymentResult();
        }
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.loadingService.setLoading(false);
      },
    });
    this.subscriptions.push(subscription);
  }

  getPaymentResult(): void {
    this.loadingService.setLoading(true);
    if (this.providerId && this.providerId !== '0') {
      const subscription = this.apiService.paymentResult(this.providerId).subscribe({
        next: (res) => {
          this.paymentResultData = res.data;
          this.generateActionResultData(res.data.paymentSuccess);
          this.uniqueCode = this.paymentResultData.uniqueCode;
          this.service.setUniqueCode(this.uniqueCode);
          if (this.paymentResultData.paymentSuccess) {
            this.checkHealthCheckRedirect();
          } else {
            this.loadingService.setLoading(false);
          }
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
          this.loadingService.setLoading(false);
        },
      });
      this.subscriptions.push(subscription);
    } else {
      this.loadingService.setLoading(false);
      this.generateActionResultData(false);
    }
  }

  generateActionResultData(isSucceed: boolean): void {
    this.actionResultData = {
      title: isSucceed ? 'پرداخت حق بیمه، با موفقیت انجام شد!' : 'پرداخت حق بیمه انجام نشد!',
      imageSrc: isSucceed ? 'insurance-assets/images/payment-success-renewal.svg' : 'insurance-assets/images/renewal-failed-payment.svg',
      imageAlt: isSucceed ? 'Payment Succeed' : 'Payment Failed',
    };
  }

  continueProcess(): void {
    const baseUrl =
      this.journey === JourneyNamesModel.RENEWAL
        ? '/mini-app/insurance/equipment/renewal?code='
        : '/mini-app/insurance/equipment/used?code=';
    window.location.href = baseUrl + this.uniqueCode;
  }

  checkHealthCheckRedirect(): void {
    this.loadingService.setLoading(true);
    const subscription = this.apiService
      .checkRedirectToHealthCheck(this.uniqueCode)
      .pipe(finalize(() => this.loadingService.setLoading(false)))
      .subscribe({
        next: (res) => {
          this.isHealthCheckAvailable = res.data;
        },
        error: (e) => {
          this.messageService.showErrorIfExists(e);
        },
      });
    this.subscriptions.push(subscription);
  }

  setHealthCheck(val: boolean): void {
    this.service.setShowHealthCheckSubject(val);
  }

  goToStepper(): void {
    const baseUrl = INSURANCE_APP_PREFIX + (this.journey === JourneyNamesModel.RENEWAL ? '/equipment/renewal?code=' : '/equipment/used?code=');
    window.location.href = baseUrl + this.uniqueCode;
  }

  openInChrome(): void {
    window.open(`googlechrome://${window.location.href}`, '_blank');
  }

  showOpenInChromeIphone(): boolean {
    return (
      this.isMobileOrTablet &&
      (this.osName === OsNames.iOS || this.osName === OsNames.Android) &&
      this.productCategory === ProductCategoryModel.MOBILE &&
      this.browserName !== 'Chrome'
    );
  }

  showOpenInChromeIpad(): boolean {
    return !this.isMobileOrTablet && this.productCategory === ProductCategoryModel.TABLET && this.browserName !== 'Chrome';
  }

  showHealthCheckBtn(): boolean {
    if (this.osName && (this.osName === OsNames.iOS || this.osName === OsNames.Android)) {
      return this.isHealthCheckAvailable && this.isMobileOrTablet;
    } else {
      return false;
    }
  }

  showRetryBtn(): boolean {
    return (this.paymentResultData && !this.paymentResultData.paymentSuccess) || this.providerId === '0';
  }

  showPaymentSuccess(): boolean {
    return this.paymentResultData && this.paymentResultData.paymentSuccess;
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false);
    this.service.removeUniqueCodeFromLS();
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
