export interface InstallmentBadge {
  text: string;
  textColor: string;
  backgroundColor: string;
}

export interface Installment {
  date: number; // dueDate & payDate
  amount: number;
  penaltyAmount: number;
  penaltyWaiverAmount: number;
  totalAmount: number;
  badge?: InstallmentBadge;
  payable: boolean;
  showReceipt: boolean;
  trackingCode: string;
  order: number;
}

export interface AggregationInstallmentFields {
  trackingCode: string;
  count: number;
  amount: number;
  clear?: boolean;
}
