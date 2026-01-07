import { GenericApiResponse } from '@client-monorepo/common/network';

export interface MerchantDetailResponse extends GenericApiResponse {
  merchantName: string;
  merchantUniqueId: string;
}
