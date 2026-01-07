import { Component, OnDestroy, OnInit } from '@angular/core';
import { FineDataService } from '../../services/fine-data.service';
import { VehiclePlateDetails } from '../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { BehaviorSubject, catchError, Subscription, throwError } from 'rxjs';
import { FineStateManagerService } from '../../services/fine-state-manager.service';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { UiDialogFinePaymentCancellationComponent } from '../../dialogs/ui-dialog-fine-payment-cancelation/ui-dialog-fine-payment-cancellation.component';
import { FineApiService } from '../../services/fine-api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrafficFinesDto } from '../../../../../api/digipay/models/driving-fine/fine-config.response';
import { TicketTypes } from '../../../../../api/digipay/models/payment/ticket-types';
import { UiDialogCompensateServiceCostShortageComponent } from '../../dialogs/ui-dialog-compensate-service-cost-shortage/ui-dialog-compensate-service-cost-shortage.component';
import { PaymentGateways } from '../../../../../api/digipay/models/tac/payment-gateways';
import { InquiryMethodType } from '../../../../../api/digipay/models/driving-fine/inquiry-method';
import { FinePaymentService } from '../../services/fine-payment.service';
import { ServicePromotion } from '../../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { AutoPaymentTicket, AutoServicePayment } from '../../services/auto-service-payment.service';
import { PaymentSelectFeatureResponse } from '../../../../../api/digipay/models/payment/payment-select-feature-response';
import { UiSpinnerComponent } from '../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiVehicleFineComponent } from '../../../../../ui/ui-components/ui-driving-fine/ui-vehicle-fine/ui-vehicle-fine.component';
import { UiCardNoticeComponent } from '../../../../../ui/ui-components/ui-card-notice/ui-card-notice.component';
import { NgIf, NgClass, NgFor, NgOptimizedImage } from '@angular/common';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-fine-payment',
  templateUrl: './fine-payment.component.html',
  styleUrls: ['./fine-payment.component.scss'],
  standalone: true,
  imports: [
    UiButtonComponent,
    UiIconDirective,
    NgIf,
    UiCardNoticeComponent,
    NgClass,
    UiVehicleFineComponent,
    UiSpinnerComponent,
    NgFor,
    NgOptimizedImage,
    RouterLink,
  ],
})
export class FinePaymentComponent implements OnInit, OnDestroy {
  finePaymentStates: 'LOADING' | 'SUCCESS' | 'SERVICE_ERROR' = 'LOADING';

  inquiryDetail = new BehaviorSubject<TrafficFinesDto>(null);

  subscriptions: Subscription[] = [];

  plateDetails: VehiclePlateDetails;

  vehiclePlateNo: string;

  fineTrackingCode: string;

  serviceErrorMessage: string;

  selectedInquiryMethodType: InquiryMethodType;

  PaymentGateways = PaymentGateways;

  hasFine = false;

  notices: Array<{
    text: string;
  }> = [
    {
      text: 'به صورت کلی جریمه ها ۲۴ ساعت پس از پرداخت، در پلیس +۱۰ ثبت می‌شوند.',
    },
  ];

  servicePromotions: Array<ServicePromotion>;

  constructor(
    private fineDataService: FineDataService,
    private fineStateManagerService: FineStateManagerService,
    private dialogService: DialogBottomSheetService,
    private fineApiService: FineApiService,
    private route: ActivatedRoute,
    private finePaymentService: FinePaymentService,
    private router: Router,
    private autoServicePayment: AutoServicePayment,
  ) {}

  ngOnInit(): void {
    this.fineDataService.loadCarInfoFromSessionStorage();

    this.finePaymentService.initiate(this.walletShortageHandler.bind(this), 'traffic-fines/pay/wallet', 'fine');

    this.subscriptions[0] = this.fineDataService.vehiclePlateLetterDetails.subscribe((vehiclePlateDetails) => {
      this.plateDetails = vehiclePlateDetails;
    });

    this.subscriptions[1] = this.fineDataService.vehiclePlateNo.subscribe((vehiclePlateNumber) => {
      this.vehiclePlateNo = vehiclePlateNumber;
    });

    this.subscriptions[2] = this.fineDataService.selectedInquiryMethodType.subscribe((inquiryMethodType) => {
      this.selectedInquiryMethodType = inquiryMethodType;
    });

    this.subscriptions[3] = this.fineDataService.fineInitialData.subscribe((initialData) => {
      this.servicePromotions = initialData.promotions;
    });

    this.subscriptions[4] = this.route.queryParams.subscribe((params) => {
      params.fineTrackingCode && this.handleTrackingCode(params.fineTrackingCode);
    });
  }

  handleTrackingCode(trackingCode: string) {
    this.fineTrackingCode = trackingCode;
    this.loadFineData(this.fineTrackingCode);
    this.inquiryDetail.subscribe((inquiryInfo) => {
      if (inquiryInfo && inquiryInfo.totalAmount) {
        const autoPaymentTicket = this.autoServicePayment.getAutoPaymentTicket();
        if (this.canResolveTicket(autoPaymentTicket)) {
          this.fineDataService.loadCarInfoFromSessionStorage();
          this.autoServicePayment.deleteAutoPaymentTicket();
          this.payFine(PaymentGateways.WALLET);
        }
      }
    });
  }

  canResolveTicket(autoPaymentTicket: AutoPaymentTicket): boolean {
    return autoPaymentTicket && autoPaymentTicket.step === 'fine' && autoPaymentTicket.cashInStatus === 'pending';
  }

  loadFineData(trackingCode: string) {
    this.finePaymentStates = 'LOADING';
    this.fineApiService
      .verifyInquiryAndGetDetail(trackingCode)
      .pipe(
        catchError((error) => {
          this.finePaymentStates = 'SERVICE_ERROR';
          this.serviceErrorMessage = error.result.message;
          return throwError('error');
        }),
      )
      .subscribe((inquiryResult) => {
        this.inquiryDetail.next(inquiryResult.trafficFinesDto);
        if (this.inquiryDetail && this.inquiryDetail.getValue().totalAmount && this.inquiryDetail.getValue().totalAmount.amount) {
          this.hasFine = this.inquiryDetail.getValue().totalAmount.amount > 0;
        }
        this.finePaymentStates = 'SUCCESS';
      });
  }

  previousStep() {
    this.dialogService
      .open(UiDialogFinePaymentCancellationComponent, {
        width: '526px',
      })
      .then((result) => {
        if (result) {
          this.fineStateManagerService.previousStep();
          this.router.navigate([], {
            queryParams: {
              step: null,
              fineTrackingCode: null,
              data: null,
              cashInStatus: null,
            },
            queryParamsHandling: 'merge',
          });
        }
      });
  }

  payFine(selectedGateway: PaymentGateways) {
    const request = {
      amount: this.inquiryDetail.getValue().totalAmount.amount,
      billId: this.inquiryDetail.getValue().fines[0].fineDetail.billId,
      payId: this.inquiryDetail.getValue().fines[0].fineDetail.paymentId,
      redirectUrl: window.location.origin + `/services/car-fine/?step=fine&fineTrackingCode=${this.fineTrackingCode}`,
    };

    this.finePaymentService.pay(selectedGateway, TicketTypes.TRAFFIC_FINE, request);
  }

  walletShortageHandler(selectFeatureResponse: PaymentSelectFeatureResponse) {
    this.dialogService.open(UiDialogCompensateServiceCostShortageComponent, {
      width: '526px',
      data: {
        serviceName: 'خلافی خودرو',
        serviceImageID: 'driving-penalty-bill-icon',
        selectFeatureResponse,
        serviceCost: this.inquiryDetail.getValue().totalAmount.amount,
        serviceStep: 'fine',
        fineTrackingCode: this.fineTrackingCode,
        servicePromotions: this.servicePromotions,
      },
    });
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
