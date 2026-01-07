import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CrowdFundingModel, ICrowdFundingPurchaseData } from '../models';
import { BaseApiService } from '../../../../components/core/services/base-api.service';
import { FilterModel } from '../../../funds/models/filter.model';
import { ECrowdFilter } from '../../crowd-list/models/crowd-filter.model';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { PageList } from '../../../../data-access/models/base/pagelist.model';
import { CROWD_FUNDING_DETAILT, CROWD_FUNDING_LIST, CROWD_FUNDING_PROFILE } from '../../../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class CrowdFundingService {
  constructor(private baseApiService: BaseApiService) {}

  getCrowdFundingList(filter: FilterModel<ECrowdFilter>, pageNumber = 1): Observable<TServiceResult<PageList<CrowdFundingModel>>> {
    let params = new HttpParams();
    if (filter?.status?.length > 0) {
      for (const [key, value] of Object.entries(filter)) {
        params = params.append(key, value);
      }
    }

    return this.baseApiService.get(CROWD_FUNDING_LIST + `?PageNumber=${pageNumber}&PageSize=10`, params).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getCrowdProject(symbol: string): Observable<TServiceResult<CrowdFundingModel>> {
    return this.baseApiService.get(CROWD_FUNDING_DETAILT + `?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getCrowdProfile(symbol: string): Observable<TServiceResult<ICrowdFundingPurchaseData>> {
    return this.baseApiService.get(CROWD_FUNDING_PROFILE + `?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }
}
