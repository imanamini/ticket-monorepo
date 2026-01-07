import { Installment } from './installment';

export interface ContractInstallmentGroup {
  order: number;
  title: string;
  payable: boolean;
  emptyInstallmentsMessage?: string;
  installments?: Installment[];
}
