import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { WaitingPagesComponent } from '../../../../../../../components/waiting-pages/waiting-pages.component';
import { JourneyType, QueryParamKeysEnum } from '../../../../../../home/query-param-keys.enum';
import { QueryParamService } from '../../../../../../../data-access/services/query-param.service';
import { MotorStorePaymentDataService } from '../../../data-access/services/motor-store-payment-data.service';
import { ThirdPartyKeysEnum } from '../../../../third-party/data-access/enums/third-party-keys.enum';

@Component({
  selector: 'motor-go-to-payment',
  standalone: true,
  imports: [
    WaitingPagesComponent
  ],
  templateUrl: './motor-go-to-payment.component.html',
  styleUrl: './motor-go-to-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorGoToPaymentComponent implements OnInit {
  private readonly queryParamService = inject(QueryParamService);
  private readonly paymentResultService = inject(MotorStorePaymentDataService);

  ngOnInit(): void {
    this.initItems();
  }

  private initItems(): void {
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
