import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AutoServicePayment {
  ticket: AutoPaymentTicket;

  setAutoPaymentTicket(ticket: AutoPaymentTicket) {
    this.ticket = ticket;
    sessionStorage.setItem('autoPaymentTicket', JSON.stringify(this.ticket));
  }

  getAutoPaymentTicket() {
    if (!sessionStorage.getItem('autoPaymentTicket')) {
      this.ticket = null;
      return;
    }

    this.ticket = JSON.parse(sessionStorage.getItem('autoPaymentTicket'));

    return this.ticket;
  }

  deleteAutoPaymentTicket() {
    sessionStorage.removeItem('autoPaymentTicket');
  }
}

export interface AutoPaymentTicket {
  step: string;
  cashInStatus: 'pending' | 'success';
}
