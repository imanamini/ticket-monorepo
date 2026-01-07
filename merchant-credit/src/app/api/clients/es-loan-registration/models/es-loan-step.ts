import { EsLoanStepUID } from './es-loan-registration-model';

export interface EsLoanStep {
  actionType: number;
  uid: EsLoanStepUID;
  label: string;
  icon: string;
  description: string;
  requestAmount: string;
}
