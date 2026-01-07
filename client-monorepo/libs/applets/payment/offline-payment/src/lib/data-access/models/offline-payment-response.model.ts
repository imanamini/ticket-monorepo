import { ApiResultInterface } from '@client-monorepo/common/network';

export interface OfflinePaymentResponseModel {
  result: ApiResultInterface;
  trackingCode: string;
  title: string;
  imageId: string;
  titleColor: string;
  amount: number;
  providerId: string;
  time: string;
  date: string;
  creditor: OfflinePaymentCreditorResponseModel;
  creationDate: number;
  details: {
    key: string;
    value: string;
  }[];
  detailsUrl: string;
}

interface OfflinePaymentCreditorResponseModel {
  userId: string;
  name: string;
  type: number;
}
