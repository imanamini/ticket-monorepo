import { Injectable } from '@angular/core';
import { IplService } from '../ipl.service';
import { MessageService } from '../../../core/services/message.service';
import { TokenService } from '../token/token.service';
import { FeaturePayService } from '../feature-pay/feature-pay.service';
import { CreditApiService } from '../../../api/credit-api.service';
import { RefererShortKey } from '../../models/referer.model';
import { IplReceiptQueryParamKey } from '../../data-access/ipl-receipt';
import { IplDetailService } from '../ipl-detail/ipl-detail.service';

@Injectable()
export class IplPayService {

  constructor(
    private iplService: IplService,
    private messageService: MessageService,
    private tokenService: TokenService,
    private featurePayService: FeaturePayService,
    private creditApiService: CreditApiService,
    private iplDetailService: IplDetailService,
  ) {
  }

  pay() {
    this.creditApiService.registerInstallmentPayLinkTicket(
      this.iplService.userInfo().uuid,
      this.tokenService.token(),
      this.iplService.referer(),
      this.iplDetailService.registerIplTicketDetails()
    ).subscribe({
      next: res => {
        this.featurePayService.selectFeature(res.ticket).subscribe(feature => {
          switch (feature) {
            case 'IPG':
              this.featurePayService.payByIpg(res.payUrl);
              break;
            case 'DPG':
              this.dpgPay(res.ticket);
              break;
          }
        });
      },
      error: e => {
        this.messageService.showErrorIfExists(e);
      }
    });
  }

  dpgPay(ticket: string) {
    // Handle referer for back click in dpg
    const queryParam = this.iplService.referer() ? `?${RefererShortKey}=${this.iplService.referer()}` : '';
    const homeUrl = `/ipl/${this.iplService.userInfo().uuid}/cell-number${queryParam}`;
    const resultPageUrl = `pay-receipt?${IplReceiptQueryParamKey}=${this.iplService.userInfo().uuid}`;
    const selectedAmount = this.iplDetailService.registerIplTicketDetails()?.[0].amount;
    const finalAmount = selectedAmount ?? this.iplService.userInfo().totalDebt;
    this.featurePayService.payByDpg(ticket, homeUrl, resultPageUrl, finalAmount);
  }
}
