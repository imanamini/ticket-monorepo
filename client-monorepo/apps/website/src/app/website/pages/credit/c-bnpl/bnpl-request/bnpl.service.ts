import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../../../../api/base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVICE_TYPE } from '../../../../../ui/models/credit/credit-plan-group';
import { CreditAccountsResponse } from '../../../../../api/digipay/models/c-bnpl/c-bnpl.model';

@Injectable({
  providedIn: 'root',
})
export class BnplService extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  hasAvailableBnpl(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.getCreditAccounts().subscribe({
        next: (creditAccountsRes) => {
          for (let i = 0; i < creditAccountsRes.accounts.length; ++i) {
            if (creditAccountsRes.accounts[i].serviceType === SERVICE_TYPE.BNPL) {
              subscriber.next(true);
              return;
            }
          }
          subscriber.next(false);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }

  getCreditAccounts(): Observable<CreditAccountsResponse> {
    return super.get('credit/accounts/summary');
  }
}
