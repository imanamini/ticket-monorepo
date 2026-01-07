import { ApiResultInterface } from '@client-monorepo/common/network';

export interface RateOrderRequest {
  score: number;
  description: string;
}

export interface RateOrderResponse {
  result: ApiResultInterface;
}
