import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  API,
  CUSTOMER_PORTFOLIOS_API,
  CUSTOMER_PORTFOLIOS_BY_SYMBOL_API,
  PORTFOLIOS_HEAD_UP_API,
} from '../../../../data-access/constants/api';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../base-api.service';
import { IPortfoliosHeadup } from '../../models/customer-schemas';
import { IPortfolio, IPortfolios } from '../../models/customer-schemas/portfolio.interface';
import { IAgreement } from '../../models/customer-schemas/agreement.interface';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { CacheHandlerService, ETTL } from './cache-handler.service';
import { IVerifyPostalCode } from '../../models/customer-schemas/verify-postal-code.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseApiService = inject(BaseApiService);
  private cacheHandlerService = inject(CacheHandlerService);

  /**
   *
   * Get user portfolios
   *
   * @returns IPortfoliosHeadup
   */
  portfoliosHeadup(): Observable<TServiceResult<IPortfoliosHeadup>> {
    return this.baseApiService.get(PORTFOLIOS_HEAD_UP_API).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getPortfoliosBysymbol(symbol: string): Observable<TServiceResult<IPortfolio>> {
    return this.baseApiService.get(`${CUSTOMER_PORTFOLIOS_BY_SYMBOL_API}/${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getPortfolios(): Observable<TServiceResult<IPortfolios>> {
    const key = this.cacheHandlerService.getKey('portfolios', '1');
    return this.cacheHandlerService.getOrFetch(key, () => this.baseApiService.get(CUSTOMER_PORTFOLIOS_API), ETTL.SHORT_TTL);
  }

  getAgreements(name: string): Observable<TServiceResult<IAgreement>> {
    return this.baseApiService.get(`${API.customer.base}/${name}/agreement`);
  }

  signAgreements(name: string): Observable<ServiceResult> {
    return this.baseApiService.post(`${API.customer.base}/${name}/agreement/sign`, null);
  }

  verifyPostalCode(postalCode?: string): Observable<TServiceResult<IVerifyPostalCode>> {
    return this.baseApiService.post(`${API.customer.verifyPostacCode}?postalCode=${postalCode}`, null).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
