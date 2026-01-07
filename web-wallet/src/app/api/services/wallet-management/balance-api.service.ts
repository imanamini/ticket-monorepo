import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BalanceInformationResponseInterface, GiftCardsResponseInterface } from '../../models/wallet-management/balance.interface';
import { ApiService } from '../../../core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class walletManagementBalanceApiService {
  private apiService = inject(ApiService);

  getBalanceInformation(token: string): Observable<BalanceInformationResponseInterface> {
    return this.apiService.get('wallets/users/total-balance', {}, {
      headers: {
        authorization: `bearer ${token}`
      }
    });
  }

  getBalances(token: string): Observable<GiftCardsResponseInterface> {
    return this.apiService.get('wallets/users/balances', {}, {
      headers: {
        authorization: `bearer ${token}`
      }
    });
  }
}
