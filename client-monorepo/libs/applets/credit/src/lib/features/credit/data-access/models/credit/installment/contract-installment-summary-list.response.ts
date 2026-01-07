import { GenericApiResponse } from '../../generic-api-response.model';
import { ContractInstallmentSummaryHeader } from './contract-installment-summary-header';
import { ContractInstallmentSummary } from './contract-installment-summary';
import { CUSTOMER_TYPE } from './customer-type';

export interface ContractInstallmentSummaryListResponse extends GenericApiResponse {
  header: ContractInstallmentSummaryHeader;
  contracts: ContractInstallmentSummary[];
  headerMessage?: { description: string; title: string };
  bodyMessage?: { description: string; imageId: string };
  payable: boolean;
  isMultiContractSupport: boolean;
  customerType: CUSTOMER_TYPE;
  maxLimitAmount: number;
}
