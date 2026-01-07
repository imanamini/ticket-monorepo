import { Injectable } from '@angular/core';
import { readPaymentDataFromUrl } from '../../../utils/url';
import { ColorService } from '../../../user-interface/services/color.service';
import { TicketService } from './ticket.service';
import { PaymentResultStateService } from '../payment-result-state.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalResponseHandleService {

  constructor(
    private ticketService: TicketService,
    private paymentResultStateService: PaymentResultStateService
  ) {
  }

  public setStates(): void {
    readPaymentDataFromUrl().then(decodedData => {
      this.paymentResultStateService.result = decodedData;
      this.paymentResultStateService.backgroundColor = ColorService.convertDecimalToRgb(this.paymentResultStateService.result.color);
      this.ticketService.addToStorage();
    }).catch(() => {
    });
  }
}
