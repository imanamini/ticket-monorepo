import { inject, Injectable } from '@angular/core';
import { ApiService, CacheService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable, of } from 'rxjs';
import { TransactionSearchPayloadInterface } from '../models/transaction-search-payload.interface';
import { TransactionSearchResultInterface } from '../models/transaction-search-result.interface';
import { TransactionApiResponse } from '../models/transaction-api.interface';
import { PendingTransactionApiResponse } from '../models/pending-transaction';
import { UpcomingInstallmentApiResponse } from '../models/upcoming-installment-api.response';
import { UpcomingInstallmentPayload } from '../models/payment';
import { DisasterLevelService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class TransactionsApiService {
  apiService = inject(ApiService);
  cacheService = inject(CacheService);
  disasterLevelService = inject(DisasterLevelService);

  getTransactionsList(params: TransactionSearchPayloadInterface): Observable<TransactionSearchResultInterface> {
    const { page = 0, size = 100, ...sendData } = params;
    const request = new RequestBuilder(RequestTypeEnum.POST, `activities/app/search?page=${page}&size=${size}`, sendData);
    return this.apiService.call<TransactionSearchResultInterface>(request);
  }

  getUpcomingScheduledTransactions(): Observable<TransactionApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/payment/upcoming/scheduled');
    return this.apiService.call<TransactionApiResponse>(request);
  }

  getUpcomingInstallmentTransactions(noCache = false): Observable<TransactionApiResponse> {
    if (this.disasterLevelService.hideInstallments()) {
      return of({
        result: {
          message: '',
          level: '',
          status: 0,
          title: '',
        },
        paymentList: [],
      });
    }
    return new Observable<TransactionApiResponse>((subscriber) => {
      const execute = () => {
        const digipayVersionHeader = { 'Digipay-Version': '2024-12-30' };
        let request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/payment/upcoming/installment');
        request = request.enableCache(1000 * 60 * 1);
        request = request.setHeader(digipayVersionHeader);
        this.apiService
          .call<UpcomingInstallmentApiResponse>(request)
          .pipe(
            map((res) => {
              const transformedRes: TransactionApiResponse = {
                result: res.result,
                paymentList: [],
              };
              res.paymentList.forEach((item) => {
                item.payload.contractDebts.forEach((itemContractDebt) => {
                  transformedRes.paymentList.push({
                    paymentType: item.paymentType,
                    payload: {
                      ...item.payload,
                      contractDebts: itemContractDebt,
                    },
                  });
                });
              });
              const installmentDataTemp = localStorage.getItem('ins-data-temp');
              if (installmentDataTemp) {
                const temp = JSON.parse(installmentDataTemp);
                if (
                  temp.time > +new Date() - 15 * 60 * 1000 &&
                  temp.status === 'success' &&
                  temp.trackingCodes &&
                  temp.trackingCodes.length > 0
                ) {
                  transformedRes.paymentList = transformedRes.paymentList.filter((item) => {
                    return !(item.payload as UpcomingInstallmentPayload).contractDebts.ticketDetail.find((t) => {
                      return temp.trackingCodes.includes(t.trackingCode);
                    });
                  });
                }
              }
              return transformedRes;
            }),
          )
          .subscribe({
            next: (transactions) => subscriber.next(transactions),
            error: (err) => subscriber.error(),
            complete: () => subscriber.complete(),
          });
      };
      if (noCache) {
        this.cacheService.deleteFromCache('dpx/payment/upcoming/installment', false).then(execute);
      } else {
        execute();
      }
    });
  }

  getPendingTransactions(): Observable<PendingTransactionApiResponse> {
    const payload: TransactionSearchPayloadInterface = {
      restrictions: [],
      orders: [{ field: 'creationDate', order: 'desc' }],
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, 'drafts/search', payload);
    return this.apiService.call<PendingTransactionApiResponse>(request);
  }

  getBundleFrequentTransactions(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/payment/frequently/bundle');
    return this.apiService.call<PendingTransactionApiResponse>(request);
  }

  getC2CFrequentTransactions(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/payment/frequently/c2c');
    return this.apiService.call<PendingTransactionApiResponse>(request);
  }

  getPaymentResult(activityId: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `activities/${activityId}`);
    return this.apiService.call<any>(request);
  }
}
