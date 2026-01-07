import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { IInstrumentAvalible } from '../models/instrument-avalible.interface';
import { INSTRUMENT_OFFTIME_API } from '../../../data-access/constants/api';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  constructor(private baseApiService: BaseApiService) {
  }

  isAvailable(
    instrumentSymbol: string,
    type: string,
  ): Observable<TServiceResult<IInstrumentAvalible>> {
    const params = new HttpParams();
    return this.baseApiService.get(
      `${INSTRUMENT_OFFTIME_API}?instrumentSymbol=${instrumentSymbol}&instrumentOfftimeTransactionType=${type}`,
      params,
    );
  }
}
