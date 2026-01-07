import { GenericApiResponse } from '../../generic-api-response.model';
import { PAYMENT_STATUS, PRE_PAYMENT_STATUS } from './customer-type/customer-type-status';

export interface CreditPaymentStepStatusResponse extends GenericApiResponse {
  status: PAYMENT_STATUS;
}

export interface CreditPrePaymentStepStatusResponse extends GenericApiResponse {
  status: PRE_PAYMENT_STATUS;
  detail: {
    dailyRemainingDays: number;
  };
}
