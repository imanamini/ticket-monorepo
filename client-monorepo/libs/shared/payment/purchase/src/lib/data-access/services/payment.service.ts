import { Injectable } from '@angular/core';
import { stringHasKeyword } from '@client-monorepo/common/utilities';
import { PayMethodPickerService, UPG_TICKET_PREFIX } from '@client-monorepo/payment/purchase';
import { PaymentDataInterface } from '../models/payment-data.interface'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private payMethodPickerService: PayMethodPickerService) {}

  processPayment(paymentData: PaymentDataInterface): void {
    if (stringHasKeyword(paymentData.ticket, UPG_TICKET_PREFIX, false, 'START')) {
      this.payMethodPickerService.goToUpg(paymentData.redirectUrl ?? '');
      return;
    }

    this.payMethodPickerService
      .ask(paymentData.amount, paymentData.ticket)
      .then((payMethod) => {
        if (!payMethod) {
          return;
        }

        switch (payMethod.method) {
          case 'IPG':
            this.payMethodPickerService.goToIpg(payMethod, paymentData.ticket);
            break;
          case 'WALLET':
            this.payMethodPickerService.payTicketByWallet(paymentData.ticket, paymentData.homeUrl, paymentData.relativeCallbackUrl);
            break;
          case 'DPG':
            this.payMethodPickerService.payByDpg(paymentData.ticket, paymentData.homeUrl, '', paymentData.amount);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        throw error;
      });
  }
}
