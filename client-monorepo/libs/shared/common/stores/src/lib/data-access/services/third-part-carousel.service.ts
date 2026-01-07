import { computed, inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { ThirdPartyCarouselFields } from '../models/third-party-carousel.model';
import { THIRD_PARTY_CAROUSEL_Config } from '../constants/third-party-carousel.constant';
import { Coordination, LocationService } from '@client-monorepo/common/location-management';

@Injectable()
export class ThirdPartyCarouselService {
  baseMirrorUrl = 'app/dpx/mirror/';
  apiService = inject(ApiService);
  locationService = inject(LocationService);
  location = computed<Coordination | undefined>(() => {
    if (this.locationService.lastLocation() && (this.locationService.lastLocation()?.timestamp || 0) > Date.now() - 1000 * 60 * 120) {
      return this.locationService.lastLocation();
    }
    return this.locationService.defaultLocation;
  });

  transformer(store: keyof typeof THIRD_PARTY_CAROUSEL_Config): Observable<ThirdPartyCarouselFields> {
    const config = THIRD_PARTY_CAROUSEL_Config[store];
    let request: RequestBuilder;
    if (config.apiMethod === 'GET') {
      const url =
        this.baseMirrorUrl +
        config.apiUrl +
        (config.includeLocation ? '?latitude=' + this.location()?.latitude + '&longitude=' + this.location()?.longitude : '');
      request = new RequestBuilder(RequestTypeEnum.GET, url);
    } else {
      request = new RequestBuilder(RequestTypeEnum.GET, this.baseMirrorUrl + config.apiUrl + this.createBase64ApiBody(config.apiBody));
    }

    return this.apiService.call(request).pipe(map((res) => config.transformer(res)));
  }

  createBase64ApiBody(body: any): string {
    const jsonString = JSON.stringify(body);
    return '?body=' + btoa(jsonString);
  }
}
