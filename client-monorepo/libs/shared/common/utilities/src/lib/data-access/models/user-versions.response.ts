import { ApiResultInterface } from '@client-monorepo/common/network';

export interface UserVersionsResponse {
  result: ApiResultInterface;
  latest: boolean;
  forceUpdate: boolean;
  storeUrl: string;
  changelogUrl: string;
  channels: string[];
}
