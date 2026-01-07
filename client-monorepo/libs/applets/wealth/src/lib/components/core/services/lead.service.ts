import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { LEAD_API } from '../../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  constructor(private baseApiService: BaseApiService) {
  }

  getLead(): Observable<TServiceResult<boolean>> {
    return this.baseApiService.post(LEAD_API, {}).pipe(
      map((value) => value.result),
      catchError((err) => {
        return of(
          new TServiceResult<boolean>(false, err?.message, err?.error, false),
        );
      }),
    );
  }
}
