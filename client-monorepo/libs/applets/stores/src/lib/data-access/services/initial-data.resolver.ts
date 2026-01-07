import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BannerResponse, BannersApiService } from '@client-monorepo/libs/shared/common/banners';

export const initialDataResolver: ResolveFn<BannerResponse> = () => {
  const bannerApi = inject(BannersApiService);
  return bannerApi.getBanners();
};
