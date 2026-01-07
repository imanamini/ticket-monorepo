import { ApiResultInterface } from '@client-monorepo/common/network';
import { ClientInterface } from '@client-monorepo/common/user';

export interface SessionsResponse {
  clients: ClientInterface[];
  result: ApiResultInterface;
}
