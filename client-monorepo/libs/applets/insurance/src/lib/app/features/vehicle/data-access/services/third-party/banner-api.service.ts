import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarouselBanner } from '../../models/third-party/carousel-banner/carousel-banner.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class BannerApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getCarouselBanners(): Observable<UatGeneralResponse<CarouselBanner[]>> {
    return super.get(this.baseUrl + 'promotion/banners');
  }
}
