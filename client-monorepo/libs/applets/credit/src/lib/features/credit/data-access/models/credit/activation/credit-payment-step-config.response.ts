import { GenericApiResponse } from '../../generic-api-response.model';
import { CUSTOMER_TYPE_STATUS } from './customer-type/customer-type-status';

export interface CreditPaymentStepConfigResponse extends GenericApiResponse {
  icon: string;
  title: string;
  amount: number;
  tacUrl: string;
  tacTitle: string;
  hintMessage: string;
  items: string[];
  colors: number[];
  costConcern?: string;
  fundProvider?: string;
  fundProviderTitle?: string;
  customerType: CUSTOMER_TYPE_STATUS;
  stampPrice?: number;
  initialBalance?: number;
}
