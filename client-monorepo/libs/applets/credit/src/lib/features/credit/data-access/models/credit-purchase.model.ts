import { InstallmentItem } from './installment-item.model';
import { Contract } from './credit/installment/contract.model';

export interface CreditPurchase {
  imageId: string;
  title: string;
  date: string;
  amount: number;
  installmentsCount: number;
  currentInstallment: number;
  id?: any;
  items: InstallmentItem[];
  contract?: Contract;
}
