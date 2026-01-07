import { InstallmentPayment } from '../data-access/models/installment-display-data';
import { SERVICE_TYPE } from '@client-monorepo/payment/transactions';

export function areAllSamePaymentType(items: InstallmentPayment[], serviceType: SERVICE_TYPE): boolean {
  return items.length > 1 && items.every((item) => item.payload.serviceType === serviceType);
}
