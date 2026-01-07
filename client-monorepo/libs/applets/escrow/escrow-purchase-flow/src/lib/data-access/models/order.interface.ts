import { ApiResultInterface } from '@client-monorepo/common/network';

export interface OrderResponse {
  merchantName: string;
  title: string;
  price: number;
  minimumAmount: number;
  imageUrl: string;
  trackingCode: string;
  data: any;
  result: ApiResultInterface;
}

export interface TicketResponse {
  result: ApiResultInterface;
  redirectUrl: string;
}
