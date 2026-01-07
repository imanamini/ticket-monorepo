import { inject, Injectable } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ReferrerService } from '../../../../../../../../data-access/services/referrer.service';
import { QueryParamKeysEnum } from '../../../../../../../home/query-param-keys.enum';
import { PaymentResultService } from '../../../../data-access/services/payment-result.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { PaymentApiService } from '../../../../../../data-access/services/third-party/payment-api.service';
import { PurchaseTicketTypeEnum } from '../../../../../../data-access/enums/purchase-ticket-type.enum';
import { PaymentRequestTypeEnum } from '../../../../../../data-access/enums/payment-request-type.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { StoreService } from '../../../../data-access/services/store.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationFormPaymentService {
  private shareService = inject(VehicleSharedService);
  private paymentResultService = inject(PaymentResultService);
  private hybridService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);
  private paymentApiService = inject(PaymentApiService);
  private queryParamService = inject(QueryParamService);
  private storeService = inject(StoreService);

  postPaymentRequest(applicationFormId: string, requestType: PaymentRequestTypeEnum, ticketType?: PurchaseTicketTypeEnum): void {
    this.paymentApiService.paymentRequest(applicationFormId, requestType, ticketType).subscribe(res => {
      if (!res.result?.paymentUrl && !res.result.providerId) {
        return;
      }

      if (res.result?.paymentUrl) {
        let popUp: WindowProxy | null;
        if (this.shouldOpenInBrowser(ticketType)) {
          this.hybridService.openUrlInHybrid(`${window.location.origin}/mini-app/insurance${PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty]}${ThirdPartyUrlsEnum.GoToPayment}?${ThirdPartyKeysEnum.UrlGoToPayment}=${encodeURI(res.result.paymentUrl)}&${this.referrerService?.referrer ? ('&' + ThirdPartyKeysEnum.Referrer + '=' + this.referrerService?.referrer) : ''}&${QueryParamKeysEnum.JourneyType}=${this.referrerService.entryFunnelSource}&${ThirdPartyKeysEnum.FormId}=${this.storeService.getFormId()}&isHybrid=${this.hybridService.isHybrid()}`);
        } else {
          this.paymentResultService.storeOrderData({
            applicationFormId,
            isHybrid: this.hybridService.isHybrid(),
            referrer: this.referrerService?.referrer,
            [QueryParamKeysEnum.JourneyType]: this.referrerService.entryFunnelSource
          });
          popUp = window.open(res.result.paymentUrl, '_self');
        }
        try {
          popUp.focus();
        } catch (e) {
          window.location.assign(res.result.paymentUrl);
        }
      } else {
        this.queryParamService.addQueryParams({[ThirdPartyKeysEnum.ProviderId]: res.result.providerId}).then(() => {
          this.shareService.navigate(ThirdPartyUrlsEnum.PaymentResult, null, InsuranceProductTypeEnum.ThirdParty);
        });
      }
      return res;
    });
  }

  shouldOpenInBrowser(ticketType: PurchaseTicketTypeEnum): boolean {
    return this.hybridService.isHybrid() && ticketType === PurchaseTicketTypeEnum.IPG;
  }
}


