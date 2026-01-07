import { ApiResultInterface } from '@client-monorepo/common/network';

export interface CreateAppPayTicketResponse {
  result: ApiResultInterface;
  ticket: string;
}
