import { inject, Injectable } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { HighwayTollConfig } from '../models/toll-config';
import { TollDebt } from '../models/toll-debt';
import { HighwayList } from '../models/highway-list';

@Injectable({
  providedIn: 'root',
})
export class TollApiService {
  apiService = inject(ApiService);

  getConfig(): Observable<HighwayTollConfig> {
    return this.apiService.call<HighwayTollConfig>(new RequestBuilder(RequestTypeEnum.GET, 'tolls/config'));
  }

  getTollDebt(plateNumber: string): Observable<TollDebt> {
    return this.apiService.call<TollDebt>(new RequestBuilder(RequestTypeEnum.GET, `tolls/payoff/${plateNumber}`));
  }

  getHighwaysList(vehicleType: string): Observable<HighwayList> {
    return this.apiService.call<HighwayList>(new RequestBuilder(RequestTypeEnum.GET, `tolls/${vehicleType}`));
  }

  payPrePayToll(data: object): Observable<GenericApiResponse> {
    return this.apiService.call<GenericApiResponse>(new RequestBuilder(RequestTypeEnum.POST, `tolls`, data));
  }

  getTicket(body: any): Observable<{ ticket: string; redirectUrl: string }> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, `tickets`, body).setParams({ type: '18' }));
  }
}
