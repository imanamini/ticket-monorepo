import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import {
  AbTestService,
  DisasterLevelService,
  BannerType,
  BannerResponse,
  Banner
} from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root'
})
export class BannersApiService {
  apiService = inject(ApiService);
  disasterService = inject(DisasterLevelService);
  allowedBannersInDisasterMode: BannerType[] = ['Carousel', 'Section-Banner', 'Single-Image'];

  getBanners(enableCache: boolean = true, appearancePage?: string, relatedId?: string): Observable<BannerResponse> {
    if (AbTestService.canChangeBannerTime() && localStorage.getItem('ab-banner-date-time')) {
      return this.getBannersBasedOnTime(+(localStorage.getItem('ab-banner-date-time') ?? 0));
    }
    let request = new RequestBuilder(RequestTypeEnum.GET, 'app/dpx/banners/available');
    if (enableCache) {
      request = request.enableCache(15 * 1000 * 60);
    }
    if (appearancePage && relatedId) {
      request.setParams({
        relatedId,
        appearancePage
      });
    }

    if (this.disasterService.getCurrentDisasterStatus()) {
      return this.apiService.call<BannerResponse>(request).pipe(
        map((response) => {
          return {
            result: response.result,
            banners: this.filterBannersBasedOnTime(
              response.banners.filter((banner) => this.allowedBannersInDisasterMode.includes(banner.type))
            )
          };
        })
      );
    } else {
      return this.apiService.call<BannerResponse>(request).pipe(
        map((response) => {
          return {
            result: response.result,
            banners: this.filterBannersBasedOnTime(response.banners)
          };
        })
      );
    }
  }

  getBannersBasedOnTime(time: number): Observable<BannerResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app/dpx/banners/all');
    return this.apiService.call<BannerResponse>(request).pipe(
      map((response) => {
        return {
          result: response.result,
          banners: this.filterBannersBasedOnTime(response.banners, time)
        };
      })
    );
  }

  filterBannersBasedOnTime(banners: Banner[], time: number = Date.now()): Banner[] {
    return banners
      .filter((item) => {
        if (item.startTime && item.startTime > time) {
          return false;
        }
        return !(item.endTime && item.endTime < time);
      })
      .map((banner) => {
        const slides = banner.slides.filter((item) => {
          if (item.startTime && item.startTime > time) {
            return false;
          }
          return !(item.endTime && item.endTime < time);
        });
        return { ...banner, slides } as Banner;
      });
  }
}
