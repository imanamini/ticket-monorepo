import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { QueryParamsModel } from '../models/query-params.model';
import { ThirdPartyKeysEnum } from '../../features/vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { ReferrerService } from './referrer.service';

@Injectable({
  providedIn: 'root',
})

export class QueryParamService {

  private referrerService = inject(ReferrerService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  addQueryParams(queryParams: QueryParamsModel, options: NavigationExtras = {}): Promise<boolean> {
    if (!queryParams[ThirdPartyKeysEnum.Referrer] && this.referrerService.referrer) {
      queryParams[ThirdPartyKeysEnum.Referrer] = this.referrerService.referrer;
    }
    return this.router.navigate([], {
      replaceUrl: true,
      queryParamsHandling: 'merge',
      ...options,
      queryParams,
    });
  }

  removeAllQueryParams(): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: null,
      replaceUrl: true,
    });
  }

  deleteQueryParams(paramKeys: string[]): Promise<boolean> {
    const DeletedQueryParams = {};
    paramKeys.forEach(key => {
      Object.assign(DeletedQueryParams, {[key]: null});
    });
    return this.addQueryParams(DeletedQueryParams);
  }

  getQueryParams(paramKeys: string[], emitEvent: boolean = true): Observable<QueryParamsModel> {
    if (emitEvent) {
      return this.activeRoute.queryParams.pipe(
        map(data => {
          const queryParams = {};
          paramKeys.forEach(key => {
            Object.assign(queryParams, {[key]: data[key]});
          });
          return queryParams;
        })
      );
    }
    const queryParams = this.activeRoute.snapshot.queryParams;
    const result = {};
    paramKeys.forEach(key => {
      Object.assign(result, {[key]: queryParams[key]});
    });
    return new Observable(observer => {
      observer.next(result);
      observer.complete();
    });
  }

  containsQueryParams(paramKeys: string[]): boolean {
    const queryParams = this.activeRoute.snapshot.queryParams;
    let containsQueries = true;
    paramKeys.forEach(key => {
      containsQueries = !!queryParams[key];
    });
    return containsQueries;
  }
}
