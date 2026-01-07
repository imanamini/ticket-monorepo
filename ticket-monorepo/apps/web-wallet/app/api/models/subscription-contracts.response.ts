import { GenericResponse } from './generic.response';

export interface SubscriptionContractResponse extends GenericResponse {
  setCanceled: boolean;
  contractId: string;
  description: string;
  paymentPeriodDuration: {
    timeUnit: number,
    count: number
  };
  periodicAmount: number;
  providerId: string;
  status: number;
  title: string;
  trialDuration: {
    count: number;
    timeUnit: number;
  };
  validityDuration: {
    count: number;
    timeUnit: number;
  };
}

export interface SubscriptionContractsResponse extends GenericResponse {
  contracts: Array<SubscriptionContractResponse>;
}
