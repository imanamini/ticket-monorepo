import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PaymentResultService } from '../../../../data-access/services/payment-result.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { WaitingPagesComponent } from '../../../../../../../../components/waiting-pages/waiting-pages.component';
import { JourneyType, QueryParamKeysEnum } from '../../../../../../../home/query-param-keys.enum';
import { ReferrerService } from '../../../../../../../../data-access/services/referrer.service';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';

@Component({
  selector: 'go-to-payment',
  standalone: true,
  imports: [
    WaitingPagesComponent
  ],
  templateUrl: './go-to-payment.component.html',
  styleUrl: './go-to-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoToPaymentComponent implements OnInit {
  private queryParamService = inject(QueryParamService);
  private paymentResultService = inject(PaymentResultService);
  referrerService: ReferrerService = inject(ReferrerService);

  ngOnInit(): void {
    this.setInitItems();
  }

  private setInitItems(): void {
    this.queryParamService.getQueryParams([
      ThirdPartyKeysEnum.UrlGoToPayment,
      ThirdPartyKeysEnum.Referrer,
      QueryParamKeysEnum.JourneyType,
      ThirdPartyKeysEnum.FormId,
      'isHybrid'
    ], false)
      .subscribe(queryParam => {
        this.paymentResultService.storeOrderData({
          applicationFormId: queryParam[ThirdPartyKeysEnum.FormId],
          isHybrid: queryParam.isHybrid === 'true',
          referrer: queryParam[ThirdPartyKeysEnum.Referrer],
          [QueryParamKeysEnum.JourneyType]: queryParam[QueryParamKeysEnum.JourneyType] as JourneyType
        });
        try {
          window.location.assign(queryParam[ThirdPartyKeysEnum.UrlGoToPayment]);
        } catch (e) {
          window.location.href = queryParam[ThirdPartyKeysEnum.UrlGoToPayment];
        }
      });
  }
}
