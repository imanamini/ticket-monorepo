import { inject, Injectable, signal } from '@angular/core';
import { PaymentService, PaymentUrlService } from '@client-monorepo/payment/purchase';
import { FinesResponse, InquiryType } from '@client-monorepo/daily-fintech/vehicle-data';
import { MessageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FineInquiryService {
  messageService = inject(MessageService);
  paymentUrlService = inject(PaymentUrlService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  reportedFines = signal<FinesResponse>({} as FinesResponse);

  payFine(payRequest: { trackingCode: string; amount: number; billId: string; paymentId: string; inquiryType: InquiryType }) {
    this.router
      .navigate(['fine', 'pay', 'confirm'], {
        state: {
          trackingCode: payRequest.trackingCode,
          inquiryType: payRequest.inquiryType,
          amount: payRequest.amount,
          billId: payRequest.billId,
          paymentId: payRequest.paymentId,
        },
      })
      .then();
  }
}
