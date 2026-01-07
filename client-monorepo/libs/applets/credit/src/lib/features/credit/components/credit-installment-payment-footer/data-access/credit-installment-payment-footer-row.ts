export interface CreditInstallmentPaymentFooterRow {
  title: string;
  value: number;
  type: 'increase' | 'decrease' | 'default';
  status: 'success' | 'error' | 'default';
}
