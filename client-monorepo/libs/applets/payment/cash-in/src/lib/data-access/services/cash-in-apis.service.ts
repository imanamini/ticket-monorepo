import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { CashInConfig } from '../models/cash-in-config';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

@Injectable({
  providedIn: 'root',
})
export class CashInApisService {
  private apiService = inject(ApiService);

  public getConfig(): Observable<CashInConfig> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/cash-in/config');
    return this.apiService.call<CashInConfig>(request);
  }

  public createCashInPayment(amount: number, redirectUrl: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'wallets/cash-in', {
      amount,
      redirectUrl,
    });
    return this.apiService.call(request);
  }

  public consumeVoucherCode(code: string): Observable<PaymentResult> {
    const converted = convertNonEnglishDigits(code.trim());
    const request = new RequestBuilder(RequestTypeEnum.POST, 'vouchers/' + converted + '/consume');
    return this.apiService.call(request);
  }
}
