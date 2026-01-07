import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PluginService {
  private apiService = inject(ApiService);

  activePlugin(postToken: string, returnUrl: string): Observable<ApiResultInterface> {
    const request = new RequestBuilder(
      RequestTypeEnum.GET,
      `escrow-channel/announcements/divar/init?post_token=${postToken}&return_url=${returnUrl}`,
    );
    return this.apiService.call<ApiResultInterface>(request);
  }

  activePluginAll(postToken: string, returnUrl: string): Observable<ApiResultInterface> {
    const request = new RequestBuilder(
      RequestTypeEnum.GET,
      `escrow-channel/announcements/divar/init-all?post_token=${postToken}&return_url=${returnUrl}`,
    );
    return this.apiService.call<ApiResultInterface>(request);
  }
}
