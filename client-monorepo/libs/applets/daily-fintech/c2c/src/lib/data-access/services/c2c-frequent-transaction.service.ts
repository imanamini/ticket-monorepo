import { map, Observable, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { C2cApiService } from './c2c-api.service';
import { extractC2cFrequentTransaction } from '../../utils/extract-c2c-frequent-transaction';
import { C2cStateService } from './c2c-state.service';

@Injectable({
  providedIn: 'root',
})
export class C2cFrequentTransactionService {
  private c2cApiService = inject(C2cApiService);
  private c2cStateService = inject(C2cStateService);

  public loadFrequentTransactions(): Observable<any> {
    return this.c2cApiService.getRecommendation().pipe(
      map((response) =>
        response.recommendations.map((recommendation) => ({
          ...recommendation,
          ...extractC2cFrequentTransaction(recommendation),
        })),
      ),
      tap((modifiedFrequentTransactions) => {
        this.c2cStateService.c2cFrequentTransactions.set(modifiedFrequentTransactions);
      }),
    );
  }

  public loadC2cFrequentTransactionConfig(): Observable<any> {
    return this.c2cApiService
      .getRecommendationConfig()
      .pipe(tap((response) => this.c2cStateService.c2cFrequentTransactionsConfig.set(response)));
  }

  public relatedFrequentTransactions(cardIndex: string) {
    return this.c2cStateService.c2cFrequentTransactions()!.filter((i) =>
      i.info.find((ii) => {
        return ii.value === cardIndex;
      }),
    );
  }
}
