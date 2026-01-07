import { inject, Injectable } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import {
  MotorApplicationFormApiService
} from '../../../../data-access/services/third-party-motor/motor-application-form-api.service';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import { PurchaseTicketTypeEnum } from '../../../../data-access/enums/purchase-ticket-type.enum';
import { ThirdPartyMotorKeysEnum } from '../enums/third-party-motor-keys.enum';
import { THIRD_PARTY_MOTOR_ROUTES } from '../constants/third-party-motor-routes.const';
import { THIRD_PARTY_MOTOR_ROUTE } from '../constants/third-party-motor-route.const';
import { Router } from '@angular/router';
import { MotorStorePaymentDataService } from './motor-store-payment-data.service';
import { PaymentRequestTypeEnum } from '../../../../data-access/enums/payment-request-type.enum';
import { ThirdPartyKeysEnum } from '../../../third-party/data-access/enums/third-party-keys.enum';
import { MotorStoreService } from './motor-store.service';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MotorApplicationFormPaymentService {
  private paymentResultService = inject(MotorStorePaymentDataService);
  private hybridService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);
  private paymentApiService = inject(MotorApplicationFormApiService);
  private router = inject(Router);
  private storeService = inject(MotorStoreService);

  postPaymentRequest(applicationFormId: string, requestType: PaymentRequestTypeEnum, ticketType?: PurchaseTicketTypeEnum): void {
    this.paymentApiService.paymentRequest(applicationFormId,
      requestType,
      this.hybridService.isHybrid(),
      this.referrerService?.referrer || null,
      ticketType).subscribe(res => {
      if (!res.result?.paymentUrl && !res.result.providerId) {
        return;
      }

      if (res.result?.paymentUrl) {
        let popUp: WindowProxy | null;
        if (this.shouldOpenInBrowser(ticketType)) {
          popUp = window.open(`${window.location.origin}/mini-app/insurance/vehicle/${THIRD_PARTY_MOTOR_ROUTES.ThirdPartyMotor}/${THIRD_PARTY_MOTOR_ROUTE.Payment}/${THIRD_PARTY_MOTOR_ROUTE.GoToPayment}?${ThirdPartyMotorKeysEnum.UrlGoToPayment}=${encodeURI(res.result.paymentUrl)}&${this.referrerService?.referrer ? ('&' + ThirdPartyMotorKeysEnum.Referrer + '=' + this.referrerService?.referrer) : ''}&${ThirdPartyKeysEnum.FormId}=${this.storeService.getFormId()}&isHybrid=${this.hybridService.isHybrid()}`);
        } else {
          this.paymentResultService.storeOrderData({
            applicationFormId,
            isHybrid: this.hybridService.isHybrid(),
            referrer: this.referrerService?.referrer
          });
          popUp = window.open(res.result.paymentUrl, '_self');
        }

        try {
          popUp.focus();
        } catch (e) {
          window.location.assign(res.result.paymentUrl);
        }
      } else {
        this.router.navigate([`${PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor]}/${THIRD_PARTY_MOTOR_ROUTE.PaymentResult}`], {
          queryParams: {[ThirdPartyMotorKeysEnum.ProviderId]: res.result.providerId}
        });
      }
      return res;
    });
  }

  shouldOpenInBrowser(ticketType: PurchaseTicketTypeEnum): boolean {
    return this.hybridService.isHybrid() && ticketType === PurchaseTicketTypeEnum.IPG;
  }
}


