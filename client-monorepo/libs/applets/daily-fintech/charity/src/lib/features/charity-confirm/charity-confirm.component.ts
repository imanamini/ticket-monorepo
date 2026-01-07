import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentUrlService, TicketTypes } from '@client-monorepo/payment/purchase';
import { CharityService } from '../../data-access/services/charity.service';
import { CharityPurchaseModel } from '../../data-access/models/charity-purchase.model';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import {
  AppPayFeaturesBody,
  DetailCardDataInterface,
  DetailCardEnum,
  PaymentCheckoutComponent,
  TicketInfoService,
} from '@client-monorepo/payment/checkout';

@Component({
  selector: 'charity-applet-confirm',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './charity-confirm.component.html',
  styleUrl: './charity-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharityConfirmComponent implements OnInit {
  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  ticket = signal('');
  isDataCached = signal(false);
  isLoadingPage = signal(true);
  charityData = signal<CharityPurchaseModel>({} as CharityPurchaseModel);
  private ticketInfoService = inject(TicketInfoService);
  private router = inject(Router);
  private paymentUrlService = inject(PaymentUrlService);
  private charityService = inject(CharityService);
  ngOnInit(): void {
    this.checkCacheData();
    if (this.isDataCached()) return;
    this.getCharityData();
  }
  private getCharityData(): void {
    this.charityService.charityData.subscribe((data) => {
      if (data) {
        this.charityData.set(data);
        this.makeCardData();
        this.setAppPayFeatureBody();
        this.isLoadingPage.set(false);
      } else {
        this.router.navigateByUrl('/donation').then();
        return;
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
  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.DONATION,
      homeUrl: 'donation',
      amount: this.charityData()?.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
  getPayApiParams() {
    const apiParams = {
      organization: this.charityData().organization.businessId,
      amount: this.charityData().amount,
      redirectUrl: this.paymentUrlService.setPaymentUrl('donation', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('donation'),
    };
    return {
      ...apiParams,
    };
  }
  private makeCardData(): void {
    this.paymentCardData.set({
      title: this.charityData().organization.name,
      imageId: this.charityData().organization.imageId,
      details: [
        { label: 'مبلغ همیاری', value: this.charityData().amount, type: DetailCardEnum.PRICE },
        { label: 'نوع همیاری', value: 'کمک نقدی', type: DetailCardEnum.STRING },
        { label: 'کمک به', value: this.charityData().organization.description, type: DetailCardEnum.STRING },
      ],
    });
  }
}
