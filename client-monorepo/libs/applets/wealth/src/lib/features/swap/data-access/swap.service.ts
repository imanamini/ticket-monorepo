import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { API } from '../../../data-access/constants/api';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { ISwapDto, ISwapProcess } from '../models/swap-process.interface';
import { SwapPageRedirection } from '../utils/swap-page-redirection';

@Injectable({
  providedIn: 'root',
})
export class SwapService {
  private baseService = inject(BaseApiService);
  private swapPageRedirection = new SwapPageRedirection();

  swapProcess(processData: ISwapDto): Observable<TServiceResult<ISwapProcess>> {
    const query = processData.action ? `?action=${processData.action}` : '';
    return this.baseService.post(`${API.wallet.coordinator.swap}${query}`, processData).pipe(
      map((res: TServiceResult<ISwapProcess>) => {
        if (res.result.action.toLowerCase() === 'page') {
          this.swapPageRedirection.redirect(res.result.data.pageName, { ...processData, ...res.result.data }, processData.walletId);
        } else if (res.result.action.toLowerCase() === 'bottomsheet') {
          this.swapPageRedirection.redirect(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
        } else if (res.result.action.toLowerCase() === 'exceptionpage') {
          this.swapPageRedirection.redirect(res.result.data.topOnPage, { ...processData, ...res.result.data }, processData.walletId);
        }
        return res;
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
