import { Observable } from 'rxjs';
import { WALLET_BALANCE_API, WALLET_ETF_INFO_API } from '../../../data-access/constants/api';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortfoService {
  baseApiService = inject(BaseApiService);

  getWalletInfo(): Observable<TServiceResult<{ balance: number; withdrawalBalance: number }>> {
    return this.baseApiService.get(WALLET_BALANCE_API);
  }
  getEtfWalletInfo(): Observable<TServiceResult<{ bankName: string; shabaNumber: string }>> {
    return this.baseApiService.get(WALLET_ETF_INFO_API);
  }
}
