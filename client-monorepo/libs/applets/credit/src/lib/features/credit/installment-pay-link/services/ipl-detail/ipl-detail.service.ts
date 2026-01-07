import { Injectable, signal } from '@angular/core';
import { RegisterIplTicketDetail } from '../../data-access/register-ipl-ticket';

@Injectable()
export class IplDetailService {
  #registerIplTicketDetails = signal<RegisterIplTicketDetail[] | null>(null);
  #selectedInstallments = signal<Record<number, boolean> | null>(null);
  #canAggregate = signal(false);
  #personInfo = signal<string | undefined>(undefined);

  goToApp() {
    window.location.href = 'https://app.mydigipay.com';
  }

  get registerIplTicketDetails() {
    return this.#registerIplTicketDetails.asReadonly();
  }

  get selectedInstallments() {
    return this.#selectedInstallments.asReadonly();
  }

  get canAggregate() {
    return this.#canAggregate.asReadonly();
  }

  get personInfo() {
    return this.#personInfo.asReadonly();
  }

  setRegisterIplTicketDetails(ticketDetails: RegisterIplTicketDetail[]) {
    this.#registerIplTicketDetails.set(ticketDetails);
  }

  setSelectedInstallments(selectedInstallments: Record<number, boolean>) {
    this.#selectedInstallments.set(selectedInstallments);
  }

  setCanAggregate(canAggregate: boolean) {
    this.#canAggregate.set(canAggregate);
  }

  setPersonInfo(fullName: string, cellNumber: string) {
    this.#personInfo.set(fullName && fullName !== 'null null' ? fullName : (cellNumber ?? undefined));
  }
}
