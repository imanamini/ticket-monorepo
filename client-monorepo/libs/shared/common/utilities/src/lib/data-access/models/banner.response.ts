import { Banner } from './banner.interface';
import { GenericApiResponse } from '@client-monorepo/common/network';

export interface BannerResponse extends GenericApiResponse {
  banners: Banner[];
}
