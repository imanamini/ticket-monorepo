import { Component, OnInit } from '@angular/core';
import { RedirectService } from '../../../core/services/redirect.service';
import { WalletApiService } from '../../../api/wallet-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionGroupResponse } from '../../../api/models/subscription-groups.response';
import { NumberPersianText, TimePersianUnit } from '../wallet-subscription.constants';
import { MessageService } from '../../../core/services/message.service';
import { SubscriptionTicketInfoResponse } from '../../../api/models/ticket-info.response';
import { GA_SUBSCRIPTION_ID } from '../../../api/constants/ga-subscription-id';

@Component({
  selector: 'app-subscription-success',
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.scss']
})
export class SubscriptionSuccessComponent implements OnInit {

  isLoading = false;

  templateInfo: SubscriptionGroupResponse;

  ticketInfo: SubscriptionTicketInfoResponse;

  tokenExpired = false;

  GA_SUBSCRIPTION_CONTRACT_ID = GA_SUBSCRIPTION_ID.CONTRACT;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private redirectService: RedirectService
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.walletApi.inAppTac(this.getTicket()).subscribe((tacResponse) => {
      this.templateInfo = JSON.parse(localStorage.getItem('successTemplateInfo'));
      this.walletApi.getSubscriptionTicketInfo(this.getTicket(), tacResponse).subscribe((r) => {
        let callbackUrl = localStorage.getItem('subscCallbackUrl');
        const queryStringSeparator = callbackUrl.indexOf('?') === -1 ? '?' : '&';
        if (callbackUrl.indexOf('providerId') === -1) {
          callbackUrl = (callbackUrl + queryStringSeparator + 'providerId=' + r.providerId + '&status=success');
          this.setCallbackUrl(callbackUrl);
        }
        this.ticketInfo = r;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    }, (e) => {
      if (e && e.status === 401) {
        this.tokenExpired = true;
        this.messageService.showErrorMessage('خطا در اعتبارسنجی');
        setTimeout(() => {
          this.router.navigateByUrl('/manage-subscriptions/' + this.getTicket() + '/2');
        }, 3000);
      }
      this.isLoading = false;
    });
  }

  callbackToMerchant() {
    this.redirectService.setAndRedirect([]);
  }

  setCallbackUrl(callbackUrl) {
    this.redirectService.url.next(callbackUrl);
  }

  getValidityDuration() {
    return (NumberPersianText[this.templateInfo.validityDuration.count] ||
        this.templateInfo.validityDuration.count) + ' ' +
      TimePersianUnit[this.templateInfo.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return (NumberPersianText[this.templateInfo.paymentPeriodDuration.count] ||
        this.templateInfo.paymentPeriodDuration.count) + ' ' +
      TimePersianUnit[this.templateInfo.paymentPeriodDuration.timeUnit].persianUnit;
  }

  getTrialDuration() {
    if (this.templateInfo.trialDuration) {
      return this.templateInfo.trialDuration.count + ' ' +
        TimePersianUnit[this.templateInfo.trialDuration.timeUnit].persianUnit +
        ' دوره آزمایشی';
    } else {
      return false;
    }
  }

  /**
   * Get ticket from URL
   */
  private getTicket() {
    return this.route.snapshot.paramMap.get('ticket');
  }
}
