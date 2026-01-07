import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { DirectDebitAutoCashIn, DirectDebitAutoCashInResponse } from '../models/direct-debit.model';

@Injectable({
  providedIn: 'root',
})
export class AutoCashInApiService {
  private apiService = inject(ApiService);
  public sendConfig(modal: DirectDebitAutoCashIn): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, '/wallets/auto-cash-in/configs', modal);
    return this.apiService.call<ApiResultInterface>(request);
  }

  public getConfig(): Observable<DirectDebitAutoCashInResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, '/wallets/auto-cash-in/configs');
    return this.apiService.call<DirectDebitAutoCashInResponse>(request);
  }

  public deactivateConfig(): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, '/wallets/auto-cash-in/configs/deactivate');
    return this.apiService.call<ApiResultInterface>(request);
  }
}
