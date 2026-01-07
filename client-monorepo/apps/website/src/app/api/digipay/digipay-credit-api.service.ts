import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';
import { InstallmentSaleCalculatorResponse } from './models/credit/installmentSaleCalculatorResponse';

import { ReservationType } from '../../website/pages/credit/installments-sale/sub-pages/installment-sale-calculator/installment-sale-calculator.component';
@Injectable({
  providedIn: 'root',
})
export class DigipayCreditApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  calculateInstallmentSale(amount: number): Observable<InstallmentSaleCalculatorResponse> {
    return super.post(`credit/offer/installment-sales`, { amount });
  }

  getShortTermReservationHours(reservationType: ReservationType): Observable<{ shortTimeInterval: number }> {
    return super.get(`credit/cart-reservation/short-time-interval/${reservationType}`);
  }
}
