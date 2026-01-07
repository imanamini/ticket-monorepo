import { catchError, debounceTime, share, switchMap } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Params } from '@angular/router';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { PageList } from '../../../data-access/models/base/pagelist.model';
import { ITransaction_V2 } from '../../../data-access/models/transaction.model';
import { API, GET_ALL_ORDERS_API } from '../../../data-access/constants/api';
import { CacheHandlerService } from './v1/cache-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private cacheHandlerService = inject(CacheHandlerService);
  private baseApiService = inject(BaseApiService);

  private pageNumberSubject = new BehaviorSubject<number>(1);
  private filtersSubject = new BehaviorSubject<Params | null>(null);
  /**
   *
   * @param pageNumber
   * @param filters
   * @returns
   *
   * @deprecated since offline and online transactions added
   */
  getAllOrders(pageNumber: number, filters?: Params): Observable<TServiceResult<PageList<ITransaction_V2>>> {
    const params = new HttpParams();
    const filter = this.filter(filters);
    return this.baseApiService.get(GET_ALL_ORDERS_API + '?PageNumber=' + pageNumber + (filter ? `${filter}` : ''), params);
  }

  getRecentOrders(pageNumber: number, filters?: Params): Observable<TServiceResult<PageList<ITransaction_V2>>> {
    this.pageNumberSubject.next(pageNumber);
    this.filtersSubject.next(filters);

    return this.orders$;
  }

  private orders$ = combineLatest([this.pageNumberSubject, this.filtersSubject]).pipe(
    debounceTime(200),
    switchMap(([pageNumber, filters]) => {
      const filterQuery = this.filter(filters);
      if (filterQuery.length === 0) return of(null);

      const apiUrl = `${API.transactions.base}/in-progress?PageNumber=${pageNumber}${filterQuery}`;

      return this.baseApiService
        .get(apiUrl)
        .pipe(catchError((error) => of(new TServiceResult<PageList<ITransaction_V2>>(null, 'Error', error, false))));
    }),
    share(),
  );

  getTransactions(pageNumber: number, filters?: Params): Observable<TServiceResult<PageList<ITransaction_V2>>> {
    const params = new HttpParams();
    const filter = this.filter(filters);
    const key = this.cacheHandlerService.getKey('offline_transactions', pageNumber);
    return this.cacheHandlerService.getOrFetch<PageList<ITransaction_V2>>(key, () =>
      this.baseApiService.get(API.transactions.base + `?PageNumber=${pageNumber}&PageSize=10` + (filter ? `${filter}` : ''), params),
    );
  }

  private convertParamsToKeyValue(params: Params): { key: string; value: string }[] {
    return Object.entries(params).map(([key, value]) => ({
      key,
      value: String(value), // Convert value to string if necessary
    }));
  }

  private filter(filters?: Params): string {
    let result = '';
    if (filters) {
      this.convertParamsToKeyValue(filters).forEach((x) => {
        if (x) {
          result = result + ('&' + x.key + '=' + x.value);
        }
      });
    }

    return result;
  }
}
