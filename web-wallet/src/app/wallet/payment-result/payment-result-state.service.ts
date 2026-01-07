import { Injectable } from '@angular/core';
import { PaymentResult } from '../../api/models/payment-result.response';
import { TicketInfoResponse } from '../../api/models/ticket-info.response';

@Injectable({
  providedIn: 'root'
})
export class PaymentResultStateService {
  public result: PaymentResult;
  public ticketInfo: TicketInfoResponse;
  public backgroundColor: string;
  public hideUI: boolean = false;
}
