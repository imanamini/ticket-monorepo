import { ApiResultInterface } from '@client-monorepo/common/network';

export interface PaymentLinkCreate {
  requestId: string;
  amount: number;
  description: string;
}
export interface PaymentLinkCreateResult {
  result: ApiResultInterface;
  amount: number;
  ttl: number;
  description: string;
}

export interface PaymentLinkRequestInfo {
  requestId: string;
  merchantName: string;
  ttl: number;
  saleAdInfo: PaymentLinkSaleAdInfo;
}

export interface PaymentLinkSaleAdInfo {
  title: string;
  price: string | number;
  description: string;
  images: string[];
}

export interface PaymentLinkResult {
  paymentLink: PaymentLinkCreate;
  requestInfo: PaymentLinkRequestInfo;
}

export interface PaymentLinkDetail {
  linkId: string;
  amount: number;
  merchantName: string;
  description: string;
  saleAdInfo: PaymentLinkSaleAdInfo;
}
