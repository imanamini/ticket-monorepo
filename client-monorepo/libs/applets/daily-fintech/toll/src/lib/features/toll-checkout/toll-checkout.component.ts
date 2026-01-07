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
import { TollDebt } from '@client-monorepo/daily-fintech/vehicle-data';

@Component({
  selector: 'toll-applet-toll-checkout',
  standalone: true,
  imports: [PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './toll-checkout.component.html',
  styleUrls: ['./toll-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TollCheckoutComponent implements OnInit {
  stateData = signal<{ plate: string; toll: TollDebt }>({} as { plate: string; toll: TollDebt });
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
    const detailItems = this.stateData()
      .toll.details.flat()
      .map((item) => ({
        label: 'تاریخ و ساعت',
        value: item.dateString,
        type: DetailCardEnum.STRING,
      }));
    this.paymentCardData.set({
      title: 'پرداخت عوارضی',
      imageId: this.stateData()?.toll?.imageId || '',
      details: [{ label: 'پلاک خودرو', value: this.stateData()?.toll?.plate?.plateNo, type: DetailCardEnum.PLATE_NUMBER }, ...detailItems],
    });
  }

  goToPrevPage() {
    this.router
      .navigate(['toll'], {
        state: this.stateData(),
        replaceUrl: true,
      })
      .then();
  }

  getPayApiParams() {
    const billIds: string[] = [];
    this.stateData()
      .toll.details.flat()
      .map((item) => {
        billIds.push(item.billId);
      });
    const apiParams = {
      billIds,
      plateNo: this.stateData().toll.plate.plateNo,
      redirectUrl: this.paymentUrlService.setPaymentUrl('highway-toll', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('toll'),
    };

    return {
      ...apiParams,
    };
  }

  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.TOLL,
      homeUrl: 'toll',
      amount: this.stateData()?.toll?.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
}
