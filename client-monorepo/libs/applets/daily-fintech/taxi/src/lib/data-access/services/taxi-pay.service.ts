import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PayTaxiModel, TaxiBodyData, TaxiDetectData, TaxiPayInfo } from '../models/pay-taxi.model';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaxiPayService {
  taxiDetectData = new BehaviorSubject<TaxiDetectData | null>(null);
  taxiInfo = new BehaviorSubject<PayTaxiModel | null>(null);
  taxiPayInfo = new BehaviorSubject<TaxiPayInfo | null>(null);
  constructor(private apiService: ApiService) {}

  getTaxiInfoApi(data: TaxiBodyData): Observable<PayTaxiModel> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `taxi?terminalId=${data.terminalId}&institutionId=${data.institutionId}`, data);
    return this.apiService.call<PayTaxiModel>(request);
  }

  public getTaxiData(queryParams?: Params): Promise<PayTaxiModel> {
    const detectData = this.taxiDetectData.getValue();
    const data = {
      terminalId: queryParams ? queryParams['terminalId'] : detectData?.detail['terminalId'],
      institutionId: queryParams ? queryParams['institutionId'] : detectData?.detail['institutionId'],
    };
    return new Promise((resolve, reject) => {
      this.getTaxiInfoApi(data).subscribe(
        (result) => {
          resolve(result);
          this.taxiInfo.next(result);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}
