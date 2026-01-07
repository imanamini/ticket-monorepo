import { Component } from '@angular/core';
import { TICKET_EXPIRED } from './ticket-expired.const';
import { Error } from '../error';

@Component({
  selector: 'app-ticket-expired',
  templateUrl: './ticket-expired.component.html',
  styleUrls: ['./ticket-expired.component.scss']
})
export class TicketExpiredComponent extends Error {
  state = TICKET_EXPIRED;

  public backToMerchant(): void {
    this.back();
  }
}
