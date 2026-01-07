import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { OsNames } from '../../../../../../data-access/services/device/os-names';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { JourneyActionResultDataModel } from '../../../../partials/journey-action-result/models/journey-action-result-data.model';
import { JourneyActionResultComponent } from '../../../../partials/journey-action-result/journey-action-result.component';
import { AsyncPipe } from '@angular/common';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { UiLoadingSpinnerComponent } from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { getBrowserName, getOsName, isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';

@Component({
  selector: 'used-complete-information-result',
  templateUrl: './used-complete-information-result.component.html',
  standalone: true,
  imports: [JourneyActionResultComponent, AsyncPipe, JourneyButtonsComponent, UiLoadingSpinnerComponent, UiButtonComponent],
  styleUrls: ['./used-complete-information-result.component.scss'],
})
export class UsedCompleteInformationResultComponent implements OnInit, OnDestroy {
  @Input()
  journey: JourneyNamesModel;
  // Vars
  subscriptions: Subscription[] = [];
  osName: OsNames;
  isMobileOrTablet = isMobileOrTablet() || !isDesktop();
  isDesktop = isDesktop();
  browserName = getBrowserName();
  isHealthCheckAvailable: boolean;
  uniqueCode: string;
  actionResultData: JourneyActionResultDataModel;
  productCategory: ProductCategoryModel;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  orderInfo: OrderModel;
  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private loadingService: LoadingService,
    private intrackService: IntrackService,
    private apiService: UsedApiService,
    private service: SharedUsedService,
  ) {
    this.osName = OsNames[getOsName()];
  }

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.getUniqueCode();
    this.generateActionResultData();
  }

  getUniqueCode(): void {
    const subscription = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code !== this.uniqueCode) {
          this.uniqueCode = code;
          this.getOrderInfo();
          this.checkHealthCheckRedirect();
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  getOrderInfo(): void {
    const subscription = this.apiService
      .getOrderInfo(this.uniqueCode)
      .pipe(tap(() => this.hasError.emit(false)))
      .subscribe({
        next: (res) => {
          this.service.setOrderInfo(res.data);
          this.orderInfo = res.data;
        },
        error: (err) => {
          this.hasError.emit(true);
        },
      });

    this.subscriptions.push(subscription);
  }

  checkHealthCheckRedirect(): void {
    this.loadingService.setLoading(true);
    const subscription = this.apiService.checkRedirectToHealthCheck(this.uniqueCode).subscribe({
      next: (res) => {
        this.isHealthCheckAvailable = res.data;
        this.loadingService.setLoading(false);
      },
      error: (e) => {
        this.hasError.emit(true);
      },
    });
    this.subscriptions.push(subscription);
  }

  generateActionResultData(): void {
    this.actionResultData = {
      title: 'اطلاعات شما با موفقیت ثبت شد!',
      imageSrc: 'insurance-assets/images/group.svg',
      imageAlt: 'Data-Register',
    };
  }

  setHealthCheck(val: boolean): void {
    this.intrackService.sendIntrackEvent('I_ST', {
      DeviceModel: this.orderInfo?.productModel ?? '',
      DeviceBrand: this.orderInfo?.productBrand ?? '',
      DevicePrice: this.orderInfo?.announcedPrice ?? 0,
      TotalAmountPaid: (this.orderInfo?.taxAmount || 0) + (this.orderInfo?.payableAmount || 0),
      VoucherUsed: !!this.orderInfo?.voucherId,
      PaymentWay: this.orderInfo?.paymentTicketTypeTitle ?? '',
      uniquecode: this.uniqueCode ?? '',
      DeviceIMEI: this.orderInfo?.serialNumber ?? '',
    });
    this.service.setShowHealthCheckSubject(val);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
