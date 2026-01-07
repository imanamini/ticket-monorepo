import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

@Injectable()
export class CashInApisService {
  constructor(private apiService: ApiService) {}

  consumeVoucherCode(code: string | null): Observable<PaymentResult> {
    const converted = code ? convertNonEnglishDigits(code.trim()) : null;
    const request = new RequestBuilder(RequestTypeEnum.POST, 'vouchers/' + converted + '/consume');
    return this.apiService.call<PaymentResult>(request);
  }
}
