import { Observable, catchError, of, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { IFundDetail, IFundList } from '../../models/fund-schemas';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { IFundChartResult } from '../../../../features/funds/models/fund-chart.model';
import { IOrderRequest } from '../../models/fund-schemas/fund-order-request.interface';
import { IOrderResponse } from '../../models/fund-schemas/fund-order-response.interface';
import { ICheckoutRequest } from '../../models/fund-schemas/fund-checkout-request.interface';
import { API, FUND_GET_ALL_FUND_PROFILES_API, FUND_GET_CHART_API } from '../../../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class FundsService {
  private baseApiService = inject(BaseApiService);

  getAllFunds(fundType: string): Observable<TServiceResult<IFundList[]>> {
    return this.baseApiService.get(FUND_GET_ALL_FUND_PROFILES_API + (fundType ? `?fundTypeEnum=${fundType}` : '')).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getFundProfileBySymbol(symbol: string): Observable<TServiceResult<IFundDetail>> {
    return this.baseApiService.get(`/v1/fund/${symbol}/profile`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getChart(symbol: string): Observable<TServiceResult<IFundChartResult>> {
    return this.baseApiService.get(FUND_GET_CHART_API + `?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(new TServiceResult<IFundChartResult>(null, err?.error?.title, err?.error, false));
      }),
    );
  }

  createBuyOrder(order: IOrderRequest): Observable<TServiceResult<IOrderResponse>> {
    return this.baseApiService.post(API.fund.createBuyOrder, order).pipe(
      catchError((err) => {
        return throwError(err);
      }),
    );
  }

  checkout(data: ICheckoutRequest): Observable<TServiceResult<string>> {
    return this.baseApiService
      .post(API.fund.checkout, {
        orderId: data.orderId,
        callbackUrl: data.callbackUrl,
        clientMetadata: data.clientMetadata,
        ipoPaymentMethod: data.ipoPaymentMethod,
      })
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
      );
  }
}
