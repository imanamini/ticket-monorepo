import { ApiResultInterface } from '@client-monorepo/common/network';
import { ActivityInfo } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

export interface CashOutResult {
  result: ApiResultInterface;
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  detailInfo: DetailInfo[];
  trackingCode: string;
}

interface DetailInfo {
  [key: string]: {
    value: string;
    copyable: boolean;
  };
}

export interface MappedCashOutResult {
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  paymentResult: ActivityInfo[];
}
