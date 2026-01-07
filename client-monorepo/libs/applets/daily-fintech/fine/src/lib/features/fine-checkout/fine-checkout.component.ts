import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { PaymentUrlService, TicketTypes } from '@client-monorepo/payment/purchase';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import {
  AppPayFeaturesBody,
  DetailCardDataInterface,
  DetailCardEnum,
  PaymentCheckoutComponent,
  TicketInfoService,
} from '@client-monorepo/payment/checkout';
import {
  FineApiService,
  FineConfigResponse,
  InquiryType,
  VEHICLE_TYPE_TRANSLATIONS,
  VehicleType,
} from '@client-monorepo/daily-fintech/vehicle-data';
import { FinePayStateDataInterface } from '../../data-access/models/fine-pay-state-data.interface';
import { finalize } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { FineInquiryService } from '../../data-access/services/fine-inquiry.service';

@Component({
  selector: 'fine-applet-fine-checkout',
  standalone: true,
  imports: [PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './fine-checkout.component.html',
  styleUrls: ['./fine-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineCheckoutComponent implements OnInit {
  stateData = signal<FinePayStateDataInterface>({} as FinePayStateDataInterface);
  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  ticket = signal('');
  isDataCached = signal(false);
  isLoadingPage = signal(true);
  config = signal<FineConfigResponse | null>(null);
  fines = computed(() => this.fineInquiryService.reportedFines());
  private ticketInfoService = inject(TicketInfoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentUrlService = inject(PaymentUrlService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private fineApiService = inject(FineApiService);
  private messageService = inject(MessageService);
  private fineInquiryService = inject(FineInquiryService);
  ngOnInit() {
    this.checkCacheData();
    this.bottomNavigationService.hide();
    if (this.isDataCached()) return;
    this.handlePreProcessingPage();
  }

  private handlePreProcessingPage(): void {
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe((data) => {
      if (!data) {
        // invalid route state
        this.goToPrevPage();
      } else {
        this.stateData.set(data);
        this.getFineConfig();
        this.setAppPayFeatureBody();
        this.isLoadingPage.set(false);
      }
    });
  }

  private getFineConfig() {
    this.fineApiService
      .getConfig()
      .pipe(finalize(() => this.isLoadingPage.set(false)))
      .subscribe({
        next: (result) => {
          this.config.set(result);
          this.makePaymentCardData();
        },
        error: (error: any) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  private checkCacheData(): void {
    const cachedData = this.ticketInfoService.getCachedTicketData();
    if (cachedData) {
      const { ticket, cardData, featureBody } = cachedData;
      this.isDataCached.set(true);
      this.appPayFeatureBody.set(featureBody);
      this.paymentCardData.set(cardData);
      this.ticket.set(ticket);
      this.isLoadingPage.set(false);
    }
  }

  /**
   * Make card data for displaying the payment card
   */
  private makePaymentCardData() {
    const { trafficFinesDto } = this.fines();
    const vehicleTypeText = VEHICLE_TYPE_TRANSLATIONS[trafficFinesDto.vehicleType as VehicleType];
    const selectedFine = trafficFinesDto.fines.find((f) => f.fineDetail.billId === this.stateData().billId);
    const details = [{ label: `پلاک ${vehicleTypeText}`, value: trafficFinesDto.plateNo, type: DetailCardEnum.PLATE_NUMBER }];
    if (trafficFinesDto?.owner?.name) {
      details.push({
        label: `مالک ${vehicleTypeText}`,
        value: trafficFinesDto.owner.name || '',
        type: DetailCardEnum.STRING,
      });
    }
    if (selectedFine?.fineDetail.location) {
      details.push({ label: 'محل جریمه', value: selectedFine.fineDetail.location, type: DetailCardEnum.STRING });
    }
    if (selectedFine?.fineDetail.dateSimpleText) {
      details.push({ label: 'تاریخ جریمه', value: selectedFine.fineDetail.dateSimpleText, type: DetailCardEnum.STRING });
    }
    this.paymentCardData.set({
      title: 'پرداخت جریمه',
      imageId: this.config()?.landingConfig.payIcon || '',
      details,
    });
  }

  goToPrevPage() {
    this.router
      .navigate(['fine'], {
        state: this.stateData(),
        replaceUrl: true,
      })
      .then();
  }

  getPayApiParams() {
    const { trackingCode, inquiryType, amount, billId, paymentId } = this.stateData();
    const nextStepUrl = window.location.origin + `/fine/list/${trackingCode}`;
    const apiParams = {
      amount: amount,
      billId: billId,
      payId: paymentId,
      inquiryResultCallbackUrl: inquiryType === InquiryType.PARTIAL ? nextStepUrl : '',
      redirectUrl: this.paymentUrlService.setPaymentUrl('driving-fine', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('fine/pay'),
    };

    return {
      ...apiParams,
    };
  }

  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.TRAFFIC_FINE,
      homeUrl: 'fine',
      amount: this.stateData()?.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
}
