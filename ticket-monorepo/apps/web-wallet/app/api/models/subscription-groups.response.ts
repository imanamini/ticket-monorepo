import { GenericResponse } from './generic.response';

export interface SubscriptionGroupResponse extends GenericResponse {
  templateId: string;
  title: string;
  description: string;
  status: number;
  periodicAmount: number;
  validityDuration: {
    timeUnit: number,
    count: number
  };
  paymentPeriodDuration: {
    timeUnit: number,
    count: number
  };
  trialDuration: {
    timeUnit: number,
    count: number
  };
  refundStrategy: number;
}

export interface SubscriptionGroupsResponse extends GenericResponse {
  templates: Array<SubscriptionGroupResponse>;
}
