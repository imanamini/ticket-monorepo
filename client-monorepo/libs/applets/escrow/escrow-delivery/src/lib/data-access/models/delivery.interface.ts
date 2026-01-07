import { ApiResultInterface } from '@client-monorepo/common/network';

export interface DeliveryRequest {
  deliverTime: string;
  description: string;
  type: string;
}

export interface DeliveryResponse {
  result: ApiResultInterface;
}
