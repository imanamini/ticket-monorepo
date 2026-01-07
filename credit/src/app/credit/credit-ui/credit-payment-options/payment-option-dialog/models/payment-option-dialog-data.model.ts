import { PaymentOption } from '../../../models/payment-option.model';
import { CreditInfoResponse } from '../../../../api/purchase/credit-info-response.model';

export interface PaymentOptionDialogData {
  paymentOption: PaymentOption;
  creditInfo: CreditInfoResponse;
}
