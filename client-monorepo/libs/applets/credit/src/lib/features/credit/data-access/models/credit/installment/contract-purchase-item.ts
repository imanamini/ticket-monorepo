import { ContractPurchaseSubItem } from './contract-purchase-sub-item';

export interface ContractPurchaseItem {
  title: string;
  transactionItems: ContractPurchaseSubItem[];
  type?: ContractPurchaseItemType;
}

export enum ContractPurchaseItemType {
  'PURCHASE' = 1,
  'REFUND' = 12,
}
