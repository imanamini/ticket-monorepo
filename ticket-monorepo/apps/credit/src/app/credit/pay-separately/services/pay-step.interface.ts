export type PayStepStatus = 'disabled' | 'primary' | 'success' | 'danger' | 'warning';
export interface PayStep {
  title: string;
  amount: number;
  status: PayStepStatus;
  currency: string;
}
