import { PagedPayloadInterface, SearchPayloadInterface } from '@client-monorepo/common/network';

export interface ProductListPayloadInterface extends PagedPayloadInterface, SearchPayloadInterface<string> {
  keyword?: string;
  host?: string;
  available?: boolean;
}
