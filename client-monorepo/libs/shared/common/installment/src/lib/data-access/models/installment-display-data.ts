import { Payment, UpcomingInstallmentPayload } from '@client-monorepo/payment/transactions';

// Define the interface specifically for installment payments based on Payment
export interface InstallmentPayment extends Omit<Payment, 'payload'> {
  payload: UpcomingInstallmentPayload;
}

export interface InstallmentDisplayData {
  displayState: number;
  totalAmount: number;
  hasPenalty: boolean;
  date: string | null;
  daysRemaining: number;
  itemCount: number;
  items: InstallmentPayment[];
  bnplCount: number;
  creditCount: number;
}
