import { PaymentChannels } from '../constants/payment-gateway';
import { GenericApiResponse } from '@client-monorepo/common/network';
import { Store } from '@client-monorepo/stores';

export interface PurchaseModel {
  activityAmount: number;
  activityDebtorUserId: string;
  activityExerciseDate: number;
  activityPaymentChannel: PaymentChannels;
  activityTrackingCode?: string;
  activityBusinessId?: string;
  createdDate?: Date;
  store?: Store;
}

export interface PurchaseResponseModel extends GenericApiResponse {
  purchaseList?: PurchaseModel[];
}

export interface PurchasesRequestConfigModel {
  from?: number;
  to?: number;
}
