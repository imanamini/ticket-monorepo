import { CONTRACT_DEBT_STATUS } from './contract-debt-status';
import { ContractInstallmentGroup } from './contract-installment-group';

export interface ContractInstallmentSummary {
  title: string;
  contractTrackingCode: string;
  installmentGroups: ContractInstallmentGroup[];
  debtAmount?: number;
  remainingDebtAmount?: number;
  status?: CONTRACT_DEBT_STATUS;
  hintMessage?: string;
  discountAmount: number;
  clearAmount: number;
}
