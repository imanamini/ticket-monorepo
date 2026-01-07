import { TextValue } from './text-value';
import { ContractPurchaseItem } from './contract-purchase-item';

export interface ContractPurchaseGroup {
  businessImageId: string;
  businessName: TextValue;
  totalAmount: TextValue;
  transactionDetails: ContractPurchaseItem[];
}
