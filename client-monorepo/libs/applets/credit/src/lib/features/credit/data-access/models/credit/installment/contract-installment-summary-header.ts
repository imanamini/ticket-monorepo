import { SERVICE_TYPE } from '../service-type/service-type.model';
import { FeeDetails } from './fee';

export interface ContractInstallmentSummaryHeader {
  fundProviderCode: number;
  fundProviderName: string;
  creditAmount: number;
  creditAmountTitle: string;
  isExpired: boolean;
  leftLabelTitle: string;
  leftLabelValue: string;
  rightLabelTitle: string;
  rightLabelValue: string;
  color: string;
  installmentCount: number;
  serviceType: SERVICE_TYPE;
  fee: FeeDetails;
}
