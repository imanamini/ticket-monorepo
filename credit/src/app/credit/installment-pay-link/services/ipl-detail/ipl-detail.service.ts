import { Injectable, signal } from '@angular/core';
import { RegisterIplTicketDetail } from '../../../api/installment-pay-link/register-ipl-ticket';

@Injectable()
export class IplDetailService {

  #registerIplTicketDetails = signal<RegisterIplTicketDetail[]>(null);
  #selectedInstallments = signal<Record<number, boolean>>(null);

  goToApp() {
    window.location.href = 'https://app.mydigipay.com';
  }

  get registerIplTicketDetails() {
    return this.#registerIplTicketDetails.asReadonly();
  }

  get selectedInstallments() {
    return this.#selectedInstallments.asReadonly();
  }

  setRegisterIplTicketDetails(ticketDetails: RegisterIplTicketDetail[]) {
    this.#registerIplTicketDetails.set(ticketDetails);
  }

  setSelectedInstallments(selectedInstallments: Record<number, boolean>) {
    this.#selectedInstallments.set(selectedInstallments);
  }
}
