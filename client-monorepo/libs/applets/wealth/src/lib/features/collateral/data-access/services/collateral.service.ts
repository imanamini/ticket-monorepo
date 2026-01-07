import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { IProcessData } from '../models/process-data.interface';
import { ICollateralProcess, ICollateralStatusResult } from '../models';
import { BaseApiService } from '../../../../components/core/services/base-api.service';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { COLLATERAL_LAUNCH_API, COLLATERAL_PROCESS_API } from '../../../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class CollateralService {
  constructor(private baseApiService: BaseApiService) {}

  launch(symbol: string): Observable<TServiceResult<ICollateralStatusResult>> {
    return this.baseApiService.get(`${COLLATERAL_LAUNCH_API}?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  process(data?: IProcessData, apiUrl?: string): Observable<TServiceResult<ICollateralProcess>> {
    let params = new HttpParams();
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (key === 'instrumentSymbol' || (key === 'action' && value === 'start_journey')) {
          params = params.append(key, value);
        }
      }
    }

    return this.baseApiService.post(apiUrl || COLLATERAL_PROCESS_API + '?' + params, data).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }
}
