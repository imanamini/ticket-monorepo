import { SearchPayloadInterface } from '@client-monorepo/common/network';

export interface SearchVouchersBodyModel {
  page: number;
  size: number;
  project?: 'voucher-only' | 'store-summary';
  searchRequest?: SearchPayloadInterface<any>;
}
