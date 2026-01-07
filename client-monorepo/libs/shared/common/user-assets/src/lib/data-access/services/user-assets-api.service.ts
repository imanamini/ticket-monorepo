import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAssetResponseModel } from '../models/user-asset.interface';
import { ApiService, CacheService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';

@Injectable({
  providedIn: 'root',
})
export class UserAssetsApiService {
  apiService = inject(ApiService);
  cacheService = inject(CacheService);

  getUserAssets(noCache = false): Observable<UserAssetResponseModel | any> {
    return new Observable<UserAssetResponseModel>((subscriber) => {
      let request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/services/assets');
      request = request.enableCache(1000 * 60 * 10);
      const execute = () => {
        this.apiService.call<UserAssetResponseModel>(request).subscribe({
          next: (res) => subscriber.next(res),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      };
      if (noCache) {
        this.cacheService.deleteFromCache('dpx/services/assets', false).then(execute);
      } else {
        execute();
      }
    });
  }

  getUserWealth(noCache = false): Observable<any> {
    return new Observable<any>((subscriber) => {
      let request = new RequestBuilder(RequestTypeEnum.GET, 'wealth/v1/customer/portfolio-per-fund');
      request = request.enableCache(1000 * 60 * 10);
      const execute = () => {
        this.apiService.call<any>(request).subscribe({
          next: (res) => subscriber.next(res),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      };
      if (noCache) {
        this.cacheService.deleteFromCache('wealth/v1/customer/portfolio-per-fund', false).then(execute);
      } else {
        execute();
      }
    });
  }
}
