import { InstallmentItem } from './installment-item.model';

export interface CreditPurchaseHeader {
  title: string;
  imageId: string;
  purchaseAmount: number;
  remainingAmount: number;
  firstInstallmentDate: string;
  lastInstallmentDate: string;
  statusItems: InstallmentItem[];
}
