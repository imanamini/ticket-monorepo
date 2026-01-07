import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { SharedUsedService } from '../../../../routes/used/services/shared-used.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { SharedRenewalService } from '../../../../routes/renewal/services/shared-renewal.service';
import { JourneyNamesModel } from '../../../models/journey-names.model';
import {
  JourneyActionResultDataModel
} from '../../../../partials/journey-action-result/models/journey-action-result-data.model';
import {
  JourneyActionResultComponent
} from '../../../../partials/journey-action-result/journey-action-result.component';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { AsyncPipe } from '@angular/common';
import { RefundBodyModel } from '../../../../api/models/used/refund-body.model';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'health-check-result',
  templateUrl: './health-check-result.component.html',
  standalone: true,
  imports: [JourneyActionResultComponent, JourneyButtonsComponent, AsyncPipe],
  styleUrls: ['./health-check-result.component.scss'],
})
export class HealthCheckResultComponent implements OnInit, OnDestroy {
  @Input()
  journey: JourneyNamesModel;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  uniqueCode: string;
  subscriptions: Subscription[] = [];
  actionResultData: JourneyActionResultDataModel = {
    imageSrc: 'insurance-assets/images/health-check-failed.svg',
    imageAlt: 'Health Check Failed',
    title: 'متاسفانه سلامت‌سنجی دستگاه شما رد شد!',
  };
  service: SharedUsedService | SharedRenewalService;
  apiService: UsedApiService | RenewalApiService;

  constructor(
    private loadingService: LoadingService,
    private messageService: MessageService,
    private usedApiService: UsedApiService,
    private usedSharedService: SharedUsedService,
    private intrackService: IntrackService,
    private renewalApiService: RenewalApiService,
    private renewalSharedService: SharedRenewalService,
  ) {
  }

  ngOnInit(): void {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      this.service = this.renewalSharedService;
      this.apiService = this.renewalApiService;
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      this.service = this.usedSharedService;
      this.apiService = this.usedApiService;
    }
    this.getUniqueCode();
    this.sendIntrackEvent('I_UTP');
  }

  getUniqueCode(): void {
    const subscription = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  goToRefund(): void {
    const body: RefundBodyModel = {
      key: this.uniqueCode,
    };
    const subscription = this.apiService.healthCheckRefund(body).subscribe({
      next: (res) => {
        this.messageService.showApiSuccess(res);
        setTimeout(() => {
          this.sendIntrackEvent('I_RFR');
          window.location.href = INSURANCE_APP_PREFIX + '/policy/list?type=digital-equipment&status=0';
        }, 2000);
      },
      error: (err) => {
        this.messageService.showErrorIfExists(err);
      },
    });
    this.subscriptions.push(subscription);
  }

  goToStepper(): void {
    const baseUrl = this.journey === JourneyNamesModel.USED_DEVICE ? '/equipment/used?code=' : '/equipment/renewal?code=';
    window.location.href = INSURANCE_APP_PREFIX + baseUrl + this.uniqueCode;
  }

  sendIntrackEvent(eventName: string): void {
    if (this.journey === JourneyNamesModel.USED_DEVICE) {
      const orderInfoValue: OrderModel = this.usedSharedService.getOrderInfoValue();
      this.intrackService.sendIntrackEvent(eventName, {
        DeviceModel: orderInfoValue?.productModel ?? '',
        DeviceBrand: orderInfoValue?.productBrand ?? '',
        DevicePrice: orderInfoValue?.announcedPrice ?? 0,
        TotalAmountPaid: (orderInfoValue?.taxAmount || 0) + (orderInfoValue?.payableAmount || 0),
        VoucherUsed: !!orderInfoValue?.voucherId,
        PaymentWay: orderInfoValue?.paymentTicketTypeTitle ?? '',
        uniquecode: this.uniqueCode ?? '',
        DeviceIMEI: orderInfoValue?.serialNumber ?? '',
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
