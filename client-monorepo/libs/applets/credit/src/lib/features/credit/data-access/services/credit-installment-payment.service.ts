import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetConfigRequest } from '../models/credit/installment/installments-config.request';
import { MessageService } from './message.service';
import { CreditApiService } from './credit-api.service';
import { GetTicketRequest, GetTicketVersion2Request } from '../models/credit/installment/installments-ticket.request';
import { finalize } from 'rxjs';
import { CreditPaymentService } from './credit-payment.service';
import { CreditNewPaymentService } from './credit-new-payment.service';
import { RegisterIplTicketDetail } from '../../installment-pay-link/data-access/register-ipl-ticket';

interface InternalFlowPayConfig {
  getTicketPayload: GetTicketRequest;
  callbackUrl: string;
  referer?: string;
  amount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CreditInstallmentPaymentService {
  // Services
  private creditApiService = inject(CreditApiService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private creditPaymentService = inject(CreditPaymentService);
  private creditNewPaymentService = inject(CreditNewPaymentService);

  // Signals
  #gettingTicket = signal(false);

  get gettingTicket() {
    return this.#gettingTicket.asReadonly();
  }

  getInstallmentPayConfigPayload() {
    let getInstallmentPayConfigPayload: GetConfigRequest;
    if (this.activatedRoute.snapshot.queryParams['options']) {
      getInstallmentPayConfigPayload = {
        ticketRequestDetails: JSON.parse(this.activatedRoute.snapshot.queryParams['options']),
      };
    }
    return getInstallmentPayConfigPayload!;
  }

  outOfRangeAmountHandler() {
    this.messageService.showErrorMessage('مبلغ قابل پرداخت در بازه مجاز نمی‌باشد.');
  }

  /*
  To handle paid Installments in Dpx (work around)
   */
  private savePayingInstallments(getTicketPayload: GetTicketRequest) {
    const trackingCodes = getTicketPayload.ticketRequestDetails.map((item) => item.trackingCode);
    const installmentInfo = {
      trackingCodes,
      time: +new Date(),
      status: 'inProgress',
    };
    localStorage.setItem('ins-data-temp', JSON.stringify(installmentInfo));
  }

  internalFlowPay({ getTicketPayload, referer, amount, callbackUrl }: InternalFlowPayConfig) {
    this.#gettingTicket.set(true);
    this.creditApiService
      .getTicketForInstallmentPay(getTicketPayload, callbackUrl, referer)
      .pipe(finalize(() => this.#gettingTicket.set(false)))
      .subscribe({
        next: (response) => {
          this.savePayingInstallments(getTicketPayload);
          this.creditPaymentService.pay('credit', response.ticket, amount).then();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  externalFlowPay(getTicketPayload: GetTicketVersion2Request, amount: number, callbackUrl: string) {
    this.#gettingTicket.set(true);
    this.creditApiService
      .getInstallmentTicketVersion2(getTicketPayload, callbackUrl)
      .pipe(finalize(() => this.#gettingTicket.set(false)))
      .subscribe({
        next: (response) => {
          this.creditNewPaymentService.pay(response.ticket, response.redirectUrl!, amount);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  /*
  Use pay by link ticket which is of type version 1
   */
  payByLinkTicketFlow(
    uuid: string,
    referer: string | null = null,
    ticketDetails: RegisterIplTicketDetail[] | null = null,
    callbackUrl: string,
  ) {
    this.#gettingTicket.set(true);
    this.creditApiService
      .registerInstallmentPayLinkTicket(uuid, referer, ticketDetails, callbackUrl)
      .pipe(finalize(() => this.#gettingTicket.set(false)))
      .subscribe({
        next: (response) => {
          this.creditPaymentService.pay('credit', response.ticket).then();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }
}
