import { Component, OnDestroy, OnInit } from '@angular/core';
import { FineDataService } from '../../services/fine-data.service';
import { VehiclePlateDetails } from '../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { Subscription } from 'rxjs';
import { FineApiService } from '../../services/fine-api.service';
import { FineConfigResponse } from '../../../../../api/digipay/models/driving-fine/fine-config.response';
import { FineStateManagerService } from '../../services/fine-state-manager.service';
import { InquiryMethodType } from '../../../../../api/digipay/models/driving-fine/inquiry-method';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { TicketTypes } from '../../../../../api/digipay/models/payment/ticket-types';
import { FinePaymentService } from '../../services/fine-payment.service';
import { PaymentGateways } from '../../../../../api/digipay/models/tac/payment-gateways';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiDialogCompensateServiceCostShortageComponent } from '../../dialogs/ui-dialog-compensate-service-cost-shortage/ui-dialog-compensate-service-cost-shortage.component';
import { ServicePromotion } from '../../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { AutoPaymentTicket, AutoServicePayment } from '../../services/auto-service-payment.service';
import { PaymentSelectFeatureResponse } from '../../../../../api/digipay/models/payment/payment-select-feature-response';
import { CurrencyPipe } from '../../../../../ui/ui-pipes/currency.pipe';
import { UiCardNoticeComponent } from '../../../../../ui/ui-components/ui-card-notice/ui-card-notice.component';
import { UiSpinnerComponent } from '../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiVehicleSimplePlateComponent } from '../../../../../ui/ui-components/ui-vehicle-simple-plate/ui-vehicle-simple-plate/ui-vehicle-simple-plate.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-inquiry-cost-payment',
  templateUrl: './inquiry-cost-payment.component.html',
  styleUrls: ['./inquiry-cost-payment.component.scss'],
  standalone: true,
  imports: [
    UiVehicleSimplePlateComponent,
    UiButtonComponent,
    UiIconDirective,
    NgIf,
    UiSpinnerComponent,
    UiCardNoticeComponent,
    NgFor,
    NgOptimizedImage,
    RouterLink,
    CurrencyPipe,
    NgxIcon,
  ],
})
export class InquiryCostPaymentComponent implements OnInit, OnDestroy {
  vehiclePlateDetails: VehiclePlateDetails;

  vehiclePlateNo: string;

  vehiclePlateTitle: string;

  inquiryCostPaymentState: 'LOADING' | 'SERVICE_ERROR' | 'LOADED' = 'LOADING';

  selectedInquiryMethodType: InquiryMethodType;

  subscriptions: Subscription[] = [];

  inquiryConfig: FineConfigResponse;

  PaymentGateways = PaymentGateways;

  notices: Array<{
    text: string;
  }> = [
    {
      text: 'این هزینه به طور کامل توسط پلیس راهور برای استعلام خلافی دریافت می‌شود.',
    },
    {
      text: 'در صورت اشتباه بودن پلاک هزینه پرداخت شده به راهور جهت استعلام عودت داده نمی شود.',
    },
  ];

  servicePromotions: Array<ServicePromotion>;

  constructor(
    private fineDataService: FineDataService,
    private fineApiService: FineApiService,
    private fineStateManager: FineStateManagerService,
    private dialogService: DialogBottomSheetService,
    private finePaymentService: FinePaymentService,
    private route: ActivatedRoute,
    private autoServicePayment: AutoServicePayment,
  ) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.fineDataService.vehiclePlateLetterDetails.subscribe((vehiclePlateLetter) => {
      this.vehiclePlateDetails = vehiclePlateLetter;
    });

    this.subscriptions[1] = this.fineDataService.vehiclePlateNo.subscribe((vehiclePlateNumber) => {
      this.vehiclePlateNo = vehiclePlateNumber;
    });

    this.subscriptions[2] = this.fineDataService.vehicleTitle.subscribe((vehiclePlateTitle) => {
      this.vehiclePlateTitle = vehiclePlateTitle;
    });

    this.subscriptions[3] = this.fineApiService.getConfig().subscribe((response) => {
      this.inquiryConfig = response;
      this.inquiryCostPaymentState = 'LOADED';
    });

    this.subscriptions[4] = this.fineDataService.selectedInquiryMethodType.subscribe((inquiryMethodType) => {
      this.selectedInquiryMethodType = inquiryMethodType;
    });

    const autoPaymentTicket = this.autoServicePayment.getAutoPaymentTicket();
    if (this.canResolveTicket(autoPaymentTicket)) {
      this.autoServicePayment.deleteAutoPaymentTicket();
      this.fineDataService.loadCarInfoFromSessionStorage();
      this.payInquiryCost(PaymentGateways.WALLET);
    }

    this.subscriptions[5] = this.fineDataService.fineInitialData.subscribe((initialData) => {
      this.servicePromotions = initialData.promotions;
    });

    this.finePaymentService.initiate(this.walletShortageHandler.bind(this), 'traffic-fines/inquiry/pay/wallet', 'inquiry');
  }

  canResolveTicket(autoPaymentTicket: AutoPaymentTicket): boolean {
    return autoPaymentTicket && autoPaymentTicket.step === 'inquiry' && autoPaymentTicket.cashInStatus === 'pending';
  }

  payInquiryCost(selectedGateway: PaymentGateways) {
    const request = {
      plateNo: this.vehiclePlateNo,
      inquiryType: +this.selectedInquiryMethodType,
      redirectUrl: window.location.origin + '/services/car-fine/?step=inquiry',
      inquiryResultCallbackUrl: window.location.origin + '/services/car-fine/?step=inquiry',
      vehicleType: 1,
    };

    this.finePaymentService.pay(selectedGateway, TicketTypes.TRAFFIC_FINE_INQUIRY, request);
  }

  walletShortageHandler(selectFeatureResponse: PaymentSelectFeatureResponse) {
    this.dialogService.open(UiDialogCompensateServiceCostShortageComponent, {
      width: '526px',
      data: {
        serviceName: 'خلافی خودرو',
        serviceImageID: 'driving-penalty-bill-icon',
        serviceCost: this.inquiryConfig.landingConfig.inquiryAmount,
        selectFeatureResponse,
        serviceStep: 'inquiry',
        servicePromotions: this.servicePromotions,
      },
    });
  }

  previousStep() {
    this.fineStateManager.previousStep();
  }

  retryGetConfig() {
    this.inquiryCostPaymentState = 'LOADING';
    this.subscriptions[3] = this.fineApiService.getConfig().subscribe((response) => {
      this.inquiryConfig = response;
      this.inquiryCostPaymentState = 'LOADED';
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
