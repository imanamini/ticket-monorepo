import { Component, OnInit } from '@angular/core';
import { WalletApiService } from '../../api/wallet-api.service';
import { TicketInfoResponse } from '../../api/models/ticket-info.response';
import { RedirectFormData, RedirectService } from '../../core/services/redirect.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { PaymentResultEnum } from '../../api/emuns/payment-result.enum';
import { ExternalResponseHandleService } from './services/external-response-handle.service';
import { TacResponse } from '../../api/models/tac.response';
import { TicketService } from './services/ticket.service';
import { InternalResponseHandleService } from './services/internal-response-handle.service';
import { PaymentResultStateService } from './payment-result-state.service';
import { RedirectFormDataModeling } from './redirect-form-data-modeling';
import { GetCallbackUrl, RemoveAllStorage } from '../../utils/storage';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html'
})
export class PaymentResultComponent implements OnInit {

  constructor(
    private externalResponseHandleService: ExternalResponseHandleService,
    private internalResponseHandleService: InternalResponseHandleService,
    public stateService: PaymentResultStateService,
    private redirectService: RedirectService,
    private walletApi: WalletApiService,
    private pageTitleService: PageTitleService,
    private ticketService: TicketService,
  ) {
    this.pageTitleService.setTitle('نتیجه پرداخت');
  }

  async ngOnInit(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
      this.externalResponseHandleService.setStates();
      this.setTicketInfo();
    } else {
      await this.internalResponseHandleService.setStates();
      this.callFinishIfHideUI();
    }
  }

  private setTicketInfo(): void {
    this.walletApi.inAppTac(this.ticketService.get())
      .subscribe((tacResponse: TacResponse) => {
        this.walletApi.getTicketInfo(this.ticketService.get(), tacResponse)
          .subscribe((info: TicketInfoResponse) => {
            this.stateService.ticketInfo = info;
          });
      });
  }

  /**
   * Finish action
   * Goes to the callbackUrl/redirectUrl
   */
  public finish(): void {
    const RESULT_FIELD = {key: 'result', value: PaymentResultEnum[this.stateService.result.paymentResult]};
    const callbackUrl = this.callbackUrlBasedOnPriority();
    const userDetail: Array<RedirectFormData> = [];
    userDetail.push(...RedirectFormDataModeling.setPaymentWalletType(this.stateService.result || null));
    userDetail.push(...RedirectFormDataModeling.setUserDetailBasedOnPayInfo(this.stateService.result || null));
    userDetail.push(...RedirectFormDataModeling.setUserDetailBasedOnPurchase(this.stateService.ticketInfo || null));
    const uniqUserDetail: Array<RedirectFormData> = this.removeAllDuplicatesFromArray(userDetail);
    this.redirectService.url.next(callbackUrl);
    this.redirectService.setAndRedirect([...uniqUserDetail, RESULT_FIELD]);
    RemoveAllStorage();
  }

  private callbackUrlBasedOnPriority(): string {
    if (this.stateService.result.redirectDetail) {
      return this.stateService.result.redirectDetail.path;
    }
    if (this.stateService.ticketInfo && this.stateService.ticketInfo.purchase) {
      return this.stateService.ticketInfo.purchase.callbackURL;
    }
    if (this.stateService.ticketInfo.redirectUrl) {
      return this.stateService.ticketInfo.redirectUrl;
    }
    return GetCallbackUrl();
  }

  private removeAllDuplicatesFromArray(userDetail: Array<RedirectFormData>): Array<RedirectFormData> {
    return userDetail.filter(
      (currentValue, index, array) =>
        array.findIndex(object2 => (object2.key === currentValue.key)) === index
    );
  }

  private callFinishIfHideUI(): void {
    if (this.stateService.hideUI === true) {
      this.finish();
    }
  }
}
