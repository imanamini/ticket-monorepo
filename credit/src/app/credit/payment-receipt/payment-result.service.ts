import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { fixActivityInfoArray } from 'src/app/utils/strings';
import {
  PaymentResultDataModel, PaymentResultEnumMapper,
  PaymentResultServiceResponse
} from '../credit-ui/credit-payment-result/credit-payment-result.model';

@Injectable()
export class PaymentResultService {

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  private static getFixedData(Data: PaymentResultDataModel): PaymentResultServiceResponse {
    return {
      trackingCode: Data.trackingCode,
      paymentResult: {
        result: Data.result,
        paymentResult: PaymentResultEnumMapper[Data.paymentResult],
        items: fixActivityInfoArray(Data.activityInfo),
        title: Data.title,
        message: Data?.message,
        amount: Data.amount,
        autoRedirect: false,
      }
    };
  }

  getPaymentResult(): Promise<PaymentResultServiceResponse> {

    return new Promise((resolve, reject) => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('data')) {
        const data = urlParams.get('data');
        if (data) {
          const decodedData = this.decodeData(data);
          return resolve(PaymentResultService.getFixedData(decodedData as PaymentResultDataModel));
        }
      } else {
        this.route.paramMap
          .pipe(map(() => window.history.state))
          .subscribe(data => {
            if (data.paymentResult) {
              return resolve(PaymentResultService.getFixedData(data.paymentResult as PaymentResultDataModel));
            } else {
              reject();
            }
          });
      }
    });
  }

  decodeData(data: string) {
    return JSON.parse(Base64.decode(decodeURIComponent(data)));
  }

}
