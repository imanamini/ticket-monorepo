import { ApiResultInterface } from '@client-monorepo/common/network';

export interface PagedApiResultInterface extends ApiResultInterface {
  totalElements: number;
  totalPages: number;
}
