import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../../../../data-access/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FakeButtonApiService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  postFakePaymentData(File: FormData): any {
    return this.http.post('digipay/api/insurance/unbundled/callBack', File);
  }

  paymentResult(providerId: string): Observable<any> {
    return super.get(`../../digipay/api/insurance/unbundled/payment-result?providerId=${providerId}`);
  }
}
