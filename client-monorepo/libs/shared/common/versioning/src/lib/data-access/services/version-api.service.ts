import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { HybridVersion, NgxHybridService } from '@digipay/ngx-hybrid-service';
import { VersionResponse } from '../models/latest-version-response.interface';

@Injectable({
  providedIn: 'root',
})
export class VersionApiService {
  private apiService = inject(ApiService);
  private ngxHybridService = inject(NgxHybridService);

  getNativeVersionApi(): Observable<VersionResponse> {
    return from(this.ngxHybridService.getHybridVersion()).pipe(
      switchMap((hybridVersion: HybridVersion) => {
        const apiVersion = hybridVersion?.apiVersion || '2025-01-01';
        const request = new RequestBuilder(RequestTypeEnum.GET, 'versions/latest').setHeader({
          'Digipay-Version': apiVersion,
        });
        return this.apiService.call<VersionResponse>(request);
      }),
    );
  }
}
