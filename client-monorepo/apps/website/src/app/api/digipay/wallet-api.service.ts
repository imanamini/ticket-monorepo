import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentResult } from './models/payment/payment-result';
import { CashInTicketResponse } from './models/wallet/cash-in-ticket.response';
import { PaymentConfig } from './models/payment/payment-config.model';
import { CashInConfig } from './models/wallet/cash-in-config';

@Injectable({
  providedIn: 'root',
})
export class WalletApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getWalletBalance(): Observable<{
    amount: number;
  }> {
    return super.get('wallets/balance');
  }

  payByWallet(relativePayUrl, ticket): Observable<PaymentResult> {
    return super.post(
      relativePayUrl,
      {
        type: 'wallet',
        ticket,
      },
      ticket,
    );
  }

  getConfig(): Observable<PaymentConfig> {
    return super.get('payments/config');
  }

  getCashInConfig(): Observable<CashInConfig> {
    return super.get('wallets/cash-in/config');
  }

  createCashInPayment(amount: number, redirectUrl: string): Observable<CashInTicketResponse> {
    return this.post('wallets/cash-in', {
      amount,
      redirectUrl,
    });
  }
}
