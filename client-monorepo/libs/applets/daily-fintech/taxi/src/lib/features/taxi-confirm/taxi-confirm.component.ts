import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { TaxiService } from '../../data-access/services/taxi.service';
import { TaxiConfirmDataModel } from '../../data-access/models/taxi-confirm-data.model';
import {
  AppPayFeaturesBody,
  DetailCardDataInterface,
  DetailCardEnum,
  PaymentCheckoutComponent,
  TicketInfoService,
} from '@client-monorepo/payment/checkout';
import { PaymentUrlService, TicketTypes } from '@client-monorepo/payment/purchase';

@Component({
  selector: 'taxi-applet-confirm',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './taxi-confirm.component.html',
  styleUrl: './taxi-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxiConfirmComponent implements OnInit {
  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  ticket = signal('');
  isDataCached = signal(false);
  isLoadingPage = signal(true);
  confirmModel!: TaxiConfirmDataModel;
  private ticketInfoService = inject(TicketInfoService);
  private router = inject(Router);
  private taxiService = inject(TaxiService);
  private paymentUrlService = inject(PaymentUrlService);
  ngOnInit(): void {
    this.checkCacheData();
    if (this.isDataCached()) return;
    this.taxiService.taxiConfirmData.subscribe((data) => {
      if (data === null) {
        this.router.navigate(['qr'], {}).then();
        return;
      } else {
        this.confirmModel = {
          title: data.title,
          amount: data.amount,
          plate: data.plate,
          lineDescription: data.lineDescription,
          passengersCount: data.passengersCount,
          institutionId: data.institutionId,
          terminalId: data.terminalId,
          color: data.color,
          icon: data.icon,
          carTitle: data.carTitle,
        };
      }
    });

    this.makeCardData();
    this.setAppPayFeatureBody();
    this.isLoadingPage.set(false);
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
  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.TAXI,
      homeUrl: 'taxi-pay',
      amount: this.confirmModel?.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
  getPayApiParams() {
    const apiParams = {
      institutionId: this.confirmModel.institutionId.toString(),
      passengersCount: this.confirmModel.passengersCount,
      terminalId: this.confirmModel.terminalId,
      amount: this.confirmModel.amount ? this.confirmModel.amount : 0,
      redirectUrl: this.paymentUrlService.setPaymentUrl('taxi-pay', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('taxi-pay'),
    };
    return {
      ...apiParams,
    };
  }
  private makeCardData(): void {
    this.paymentCardData.set({
      title: this.confirmModel.title,
      imageId: this.confirmModel.icon || '',
      details: [
        { label: 'پلاک ماشین', value: this.confirmModel.plate, type: DetailCardEnum.PLATE_NUMBER },
        { label: 'نوع ماشین', value: this.confirmModel.carTitle, type: DetailCardEnum.STRING },
        { label: 'خط تاکسی', value: this.confirmModel.lineDescription, type: DetailCardEnum.STRING },
      ],
    });
  }
}
