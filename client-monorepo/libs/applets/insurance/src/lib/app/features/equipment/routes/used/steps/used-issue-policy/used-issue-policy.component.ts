import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import moment from 'jalali-moment';
import { UsedStepsListModel } from '../../partials/used-steps-list/models/used-steps-list.model';
import { UsedHeaderButtonModes } from '../../partials/used-header/models/used-header-button.modes';
import { AppWindow } from '../../../../../../data-access/web-interfaces/app-window';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { UsedStepsListComponent } from '../../partials/used-steps-list/used-steps-list.component';
import { LocationTrapComponent } from '../../../../../../components/location-trap/location-trap.component';
import { UiButtonComponent } from '../../../../../../components/ui-button/ui-button/ui-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

declare const window: AppWindow;

@Component({
  selector: 'used-issue-policy',
  templateUrl: './used-issue-policy.component.html',
  standalone: true,
  imports: [JourneyButtonsComponent, UsedStepsListComponent, LocationTrapComponent, UiButtonComponent],
  styleUrls: ['./used-issue-policy.component.scss'],
})
export class UsedIssuePolicyComponent implements OnInit, OnDestroy {
  // Subscription
  subscriptions: Subscription[] = [];
  // Vars
  listItems: UsedStepsListModel[];
  uniqueCode: string;
  policyData: OrderModel;
  isMobile = isMobileOrTablet() || !isDesktop();
  showBackToAppBtn: boolean;
  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private service: SharedUsedService,
    private intrackService: IntrackService,
    private apiService: UsedApiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.showBackToAppBtn = this.service.getIsUserFromWebAppValue() || this.service.getIsUserFromNativeAppValue();
    this.getUniqueCode();
    this.setHeaderData();
    this.subscribeToCloseBtn();
  }

  subscribeToCloseBtn(): void {
    const subscription = this.service.getBackClick().subscribe({
      next: () => {
        this.router.navigate([INSURANCE_APP_PREFIX]);
      },
    });
    this.subscriptions.push(subscription);
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
    const subscription = this.apiService
      .getOrderInfo(this.uniqueCode)
      .pipe(tap(() => this.hasError.emit(false)))
      .pipe(tap(() => this.hasError.emit(false)))
      .subscribe({
        next: (res) => {
          this.policyData = res.data;
          this.generateListItems();
          this.intrackService.sendIntrackEvent('I_IIC', {
            DeviceModel: this.policyData?.productModel ?? '',
            DeviceBrand: this.policyData?.productBrand ?? '',
            DevicePrice: this.policyData?.announcedPrice ?? 0,
            TotalAmountPaid: (this.policyData?.taxAmount || 0) + (this.policyData?.payableAmount || 0),
            VoucherUsed: !!this.policyData?.voucherId,
            PaymentWay: this.policyData?.paymentTicketTypeTitle ?? '',
            uniquecode: this.uniqueCode ?? '',
            DeviceIMEI: this.policyData?.serialNumber ?? '',
          });
        },
        error: (e) => {
          this.hasError.emit(true);
        },
      });
    this.subscriptions.push(subscription);
  }

  generateListItems(): void {
    this.listItems = [
      {
        name: 'مدل دستگاه',
        value: this.policyData.productModel ? this.policyData.productModel : '-',
        isPrice: false,
      },
      {
        name: 'مالک دستگاه',
        value: this.policyData.firstName + ' ' + this.policyData.lastName,
        isPrice: false,
      },
      {
        name: 'کد ملی',
        value: this.policyData.nationalCode ? this.policyData.nationalCode : '-',
        isPrice: false,
      },
      {
        name: 'شماره بیمه نامه',
        value: this.policyData.policyNumber,
        isPrice: false,
      },
      {
        name: 'سریال دستگاه',
        value: this.policyData.serialNumber ? this.policyData.serialNumber : '-',
        isPrice: false,
      },
      {
        name: 'تاریخ صدور',
        value: this.policyData.newPolicyIssuedAt ? moment(this.policyData.newPolicyIssuedAt).locale('fa').format('YYYY/MM/DD') : 'ندارد',
        isPrice: false,
      },
      {
        name: 'پایان اعتبار',
        value: this.policyData.newPolicyExpiredAt ? moment(this.policyData.newPolicyExpiredAt).locale('fa').format('YYYY/MM/DD') : 'ندارد',
        isPrice: false,
      },
    ];
  }

  goToPolicies(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`], {queryParams: {id: this.policyData.policyNumber}}).then();
  }

  downloadPolicy(): void {
    const orderInfoValue: OrderModel = this.service.getOrderInfoValue();
    this.intrackService.sendIntrackEvent('I_RCP', {
      DeviceModel: orderInfoValue?.productModel ?? '',
      DeviceBrand: orderInfoValue?.productBrand ?? '',
      DevicePrice: orderInfoValue?.announcedPrice ?? 0,
      TotalAmountPaid: (orderInfoValue?.taxAmount || 0) + (orderInfoValue?.payableAmount || 0),
      VoucherUsed: !!orderInfoValue?.voucherId,
      PaymentWay: orderInfoValue?.paymentTicketTypeTitle ?? '',
      uniquecode: this.uniqueCode ?? '',
      DeviceIMEI: orderInfoValue?.serialNumber ?? '',
    });
    window.open(this.policyData.pdfUrl);
  }

  handleBackClick(): void {
    if (this.showBackToAppBtn) {
      this.returnToSuperApp();
    } else {
      this.goToPolicies();
    }
  }

  returnToSuperApp(): void {
    window.open('https://app.mydigipay.com');
  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: true,
      headerTitle: 'صدور بیمه نامه',
      customIcon: 'insurance-assets/icons/icon-general-close.svg',
      actionButtons: [
        {
          mode: UsedHeaderButtonModes.CUSTOM_BUTTON,
          clickHandler: () => {
            this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`]).then();
          },
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
