import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
import { VEHICLE_TYPE_TRANSLATIONS, VehicleType } from '@client-monorepo/daily-fintech/vehicle-data';
import { FineInquiryStateDataInterface } from '../../data-access/models/fine-inquiry-state-data.interface';

@Component({
  selector: 'fine-applet-fine-inquiry-checkout',
  standalone: true,
  imports: [PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './fine-inquiry-checkout.component.html',
  styleUrls: ['./fine-inquiry-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineInquiryCheckoutComponent implements OnInit {
  stateData = signal<FineInquiryStateDataInterface>({} as FineInquiryStateDataInterface);
  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  ticket = signal('');
  isDataCached = signal(false);
  isLoadingPage = signal(true);
  private ticketInfoService = inject(TicketInfoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentUrlService = inject(PaymentUrlService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  ngOnInit() {
    this.checkCacheData();
    this.bottomNavigationService.hide();
    if (this.isDataCached()) return;
    this.route.paramMap.pipe(map(() => window.history.state)).subscribe((data) => {
      if (!data) {
        // invalid route state
        this.goToPrevPage();
      } else {
        this.stateData.set(data);
        this.makePaymentCardData();
        this.setAppPayFeatureBody();
        this.isLoadingPage.set(false);
      }
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
    const fineConfig = this.stateData().config;
    const vehicleTypeText = VEHICLE_TYPE_TRANSLATIONS[this.stateData().type as VehicleType];
    const details = [{ label: `پلاک ${vehicleTypeText}`, value: this.stateData().plateNo, type: DetailCardEnum.PLATE_NUMBER }];
    if (fineConfig) {
      details.push({
        label: 'نوع',
        value: fineConfig.landingConfig.inquiryMethods.find((item: any) => item.type === this.stateData().inquiryType)?.title || '',
        type: DetailCardEnum.STRING,
      });
    }

    this.paymentCardData.set({
      title: 'استعلام جریمه',
      imageId: fineConfig.landingConfig.payIcon || '',
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
    const { plateNo, inquiryType, type } = this.stateData();
    const nextStepUrl = window.location.origin + `/fine/list/report?plateNo=${plateNo}&method=${inquiryType}&type=${type}`;
    const apiParams = {
      plateNo,
      inquiryType: +inquiryType,
      inquiryResultCallbackUrl: nextStepUrl,
      vehicleType: +type,
      redirectUrl: this.paymentUrlService.setPaymentUrl('driving-fine', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('fine/inquiry'),
    };

    return {
      ...apiParams,
    };
  }

  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.TRAFFIC_FINE_INQUIRY,
      homeUrl: 'fine',
      amount: this.stateData()?.config.landingConfig.inquiryAmount,
      additionalInfo: this.getPayApiParams(),
    });
  }
}
