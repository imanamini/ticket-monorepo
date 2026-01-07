import { GenericApiResponse } from '../../generic-api-response.model';
import { ContractPurchaseGroup } from './contract-purchase-group';

export interface ContractPurchasesResponse extends GenericApiResponse {
  title: string;
  businessTransactionDetails?: ContractPurchaseGroup[];
  message?: {
    description: string;
    imageId: string;
    title: string;
  };
}
