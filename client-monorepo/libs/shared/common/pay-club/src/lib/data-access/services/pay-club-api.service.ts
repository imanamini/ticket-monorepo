import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable, retryWhen, throwError, TimeoutError, timer } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { CoinBalanceResponse } from '../models/CoinBalanceResponse';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PayClubApiService {
  apiService = inject(ApiService);

  getUserCoinBalance(): Observable<CoinBalanceResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'scores/balance');
    return this.apiService.call<CoinBalanceResponse>(request).pipe(
      timeout(5000), // ⏱ 5 seconds
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryIndex) => {
            if (error instanceof TimeoutError && retryIndex < 1) {
              return timer(0); // immediate retry (previous request is auto-cancelled)
            }
            // ❌ do NOT retry other errors
            return throwError(() => error);
          })
        )
      ),
    );;
  }
}
