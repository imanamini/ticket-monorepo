import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TopUpPurchaseState } from '@client-monorepo/applets/top-up';
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

@Component({
  selector: 'top-up-applet-top-up-purchase',
  standalone: true,
  imports: [PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopUpPurchaseComponent implements OnInit {
  stateData = signal<TopUpPurchaseState>({} as TopUpPurchaseState);
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
      if (!data?.cellNumber) {
        // invalid route state
        this.router.navigateByUrl('/top-up', { replaceUrl: true }).then();
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
    this.paymentCardData.set({
      title: `شارژ ${this.stateData()?.operatorName}`,
      imageId: this.stateData()?.operator?.imageId || '',
      details: [
        { label: 'مبلغ شارژ', value: this.stateData()?.typePickerResult?.selectedAmount?.amount, type: DetailCardEnum.PRICE },
        { label: 'نوع شارژ', value: this.stateData()?.typePickerResult?.title, type: DetailCardEnum.STRING },
        { label: 'شماره همراه', value: this.stateData()?.cellNumber, type: DetailCardEnum.PHONE_NUMBER },
      ],
    });
  }

  goToPrevPage() {
    this.router
      .navigate(['top-up'], {
        state: this.stateData(),
        replaceUrl: true,
      })
      .then();
  }

  getPayApiParams() {
    const apiParams = {
      chargeType: this.stateData()?.typePickerResult.chargeType,
      targetedCellNumber: this.stateData()?.cellNumber,
      chargePackage: this.stateData()?.typePickerResult.selectedAmount,
      operatorId: this.stateData()?.operatorId,
      redirectUrl: this.paymentUrlService.setPaymentUrl('top-up', true),
      cellNumberType: parseInt(this.stateData()?.simType, 10),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('top-up'),
    };

    return {
      ...apiParams,
    };
  }

  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.TOP_UPS,
      homeUrl: 'top-up',
      amount: this.stateData()?.typePickerResult.selectedAmount.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
}
