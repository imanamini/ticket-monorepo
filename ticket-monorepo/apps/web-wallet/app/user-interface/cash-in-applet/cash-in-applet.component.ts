import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TacResponse } from '../../api/models/tac.response';
import { WalletApiService } from '../../api/wallet-api.service';
import { MessageService } from '../../core/services/message.service';
import { PaymentConfig } from '../../api/models/payment-config.response';
import { StorageService } from '../../core/services/storage.service';
import { RedirectService } from '../../core/services/redirect.service';
import { FEATURE_NAMES, FEATURES } from '../../api/constants';
import { MarketingAnalyticsService } from '../../core/services/marketing-analytics.service';
import { LayoutService } from '../../core/services/layout.service';
import { ScreenSize } from '../../api/models/screen-size';
import { HandleStyle } from '../../wallet/new-upg/utils/handle-style';
import { PERSISTENT_STORAGE_KEYS } from '../../core/constants';

@Component({
  selector: 'app-cash-in-applet',
  templateUrl: './cash-in-applet.component.html',
  styleUrls: ['./cash-in-applet.component.scss']
})
export class CashInAppletComponent implements OnInit {
  tacResponse: TacResponse;

  inputFocusSignal = 0;

  gettingCashInTicket = false;

  currentValue = 0;

  @Input()
  config: PaymentConfig;

  @Input()
  selectedAmount = 0;

  @Input()
  paymentUrl = '';

  @Input()
  walletBalance = 0;

  @Input()
  ticket: string;

  @Input()
  theme: 'default' | 'compact' = 'default';

  @Input()
  showDefaultSubtitle = false;

  @Input()
  changeable = true;

  @ViewChild('redirectPaymentForm', {
    static: false
  })
  redirectPaymentForm: ElementRef<HTMLFormElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    private walletApis: WalletApiService,
    private messageService: MessageService,
    private storage: StorageService,
    private redirect: RedirectService,
    private marketingAnalyticsService: MarketingAnalyticsService,
    private layoutService: LayoutService
  ) {
  }

  ngOnInit() {
    this.checkEntireValues();
  }

  getTac(): void {
    if(sessionStorage.getItem('external-cash-in-data')){
      const info = JSON.parse(sessionStorage.getItem('external-cash-in-data'));
      this.walletBalance = info.walletBalance || 0;
      this.paymentUrl = info.payUrl;
      this.redirect.url.next(info.redirectUrl);
      this.getPaymentConfig();
    }else{
      this.walletApis.inAppTac(this.ticket).subscribe(response => {
        this.tacResponse = response;
        const IPG = this.tacResponse.features[FEATURES[FEATURE_NAMES.PAYMENT_IPG]];
        if (IPG) {
          this.paymentUrl = IPG.originalUrl + '/' + this.ticket;
        }
        this.getTicketInfo(response);
      }, e => {
        this.messageService.showErrorIfExists(e);
      });
    }
  }

  getTicketInfo(tacResponse): void {
    this.walletApis.getTicketInfo(this.ticket, tacResponse).subscribe(info => {
      this.walletBalance = info.walletBalance || 0;
      this.redirect.url.next(info.redirectUrl);
      this.getPaymentConfig();
    });
  }

  getPaymentConfig(): void {
    this.walletApis.getPaymentConfig().subscribe((config: PaymentConfig) => {
      this.config = config;
      this.selectedAmount = this.config.defaultAmountValue;
      this.cdr.detectChanges();
    });
  }

  inputValueChanged(value): void {
    if (value.numericValue) {
      this.selectedAmount = value.numericValue;
    } else {
      this.selectedAmount = null;
    }
  }

  triggerClickEvent($event): void {
    let action = '';
    let status = '';
    if (typeof $event !== 'string') {
      status = $event - this.currentValue > 0 ? 'inc' : 'dec';
      this.currentValue = $event;
      action = `user click on ${status}_amount by ${$event}`;
    } else {
      action = $event;
    }
    const category = 'cash_in';
    this.marketingAnalyticsService.triggerEvent(category, action);
  }

  suggestionItemClick(value: number): void {
    this.selectedAmount = value;
    this.inputFocusSignal++;
  }

  inputTapped(): void {
    if (this.layoutService.currentSize === ScreenSize.XS) {
      setTimeout(() => {
        document.getElementsByClassName('content-card-body')[0].scrollTop = 250;
      }, 1000);
    }
  }

  cashIn(inputAmount: HTMLElement): void {
    this.triggerClickEvent('user click on continue button');

    if (this.invalidAmount) {
      new HandleStyle().animate(inputAmount);
      return;
    }

    this.walletApis.checkForCashInInput(this.selectedAmount, this.ticket).subscribe(() => {
      this.storage.persist(PERSISTENT_STORAGE_KEYS.CASH_IN, this.ticket);
      this.redirectPaymentForm.nativeElement.submit();
    }, (e) => {
      this.messageService.showErrorIfExists(e);
    });
  }

  /**
   * Disables button when:
   *
   * 1. There is another cash-in request
   * 2. Amount is empty (or zero)
   * 3. Entered amount is not in the range (based on config)
   *
   */
  get invalidAmount(): boolean {
    if (this.gettingCashInTicket || !this.selectedAmount) {
      return true;
    }

    if (this.config.minAmount && this.config.maxAmount) {
      return (this.selectedAmount < this.config.minAmount || this.selectedAmount > this.config.maxAmount);
    }

    return false;
  }

  private putStorage(): void {
    this.storage.put({
      ticket: this.ticket,
    });
  }

  private checkEntireValues(): void {
    if (this.config) {
      return;
    }
    this.putStorage();
    this.getTac();
  }

}
