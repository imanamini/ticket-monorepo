import { PaymentMethodStatus } from "./payment-method-status";

export interface IQuickPaymentState {
  name: string;
  order: number;
  balance: number;
  status: PaymentMethodStatus;
  commissionPercentage: number;

  type?: string;
  title?: string;
  iconName?: string;
  description?: string;
}
