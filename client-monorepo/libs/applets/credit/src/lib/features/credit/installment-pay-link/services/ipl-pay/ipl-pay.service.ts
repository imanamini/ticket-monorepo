import { inject, Injectable, signal } from '@angular/core';
import { IplService } from '../ipl.service';
import { IplDetailService } from '../ipl-detail/ipl-detail.service';
import { ConfigPaymentFlow } from '../../../data-access/models/credit/installment/installment-pay-config.response';
import { AggregationInstallmentFields } from '../../../data-access/models/credit/installment/installment';
import { NgxNoticeService } from '@digipay/ngx-notice';
import { GetTicketRequest, GetTicketVersion2Request } from '../../../data-access/models/credit/installment/installments-ticket.request';
import { CreditInstallmentPaymentService } from '../../../data-access/services/credit-installment-payment.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditTransactionCallbackType } from '../../../credit-payment-callback/data-access/credit-transaction-callback-type';
import { DefaultInstallmentReferer } from '../../../data-access/models/credit/installment/installment-referer.model';

@Injectable()
export class IplPayService {
  // Services
  private iplService = inject(IplService);
  private iplDetailService = inject(IplDetailService);
  private creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);
  private creditUrlService = inject(CreditUrlService);
  private noticeService = inject(NgxNoticeService);

  // Signals
  #callBackUrlAfterPay = signal('');

  pay() {
    this.setCallBackUrlAfterPay();
    this.checkDebtOwner().then((confirmed) => {
      if (confirmed) {
        if (this.iplService.userInfo()?.isPayerDebtOwner) {
          if (this.iplService.userInfo()?.paymentFlow === ConfigPaymentFlow.internal) {
            return this.internalPayFlow();
          } else {
            return this.externalPayFlow();
          }
        } else {
          return this.payByLinkTicketPayFlow();
        }
      }
    });
  }

  setCallBackUrlAfterPay() {
    this.#callBackUrlAfterPay.set(
      this.creditUrlService.getPaymentTicketCallbackUrl(CreditTransactionCallbackType.ipl, `?uuid=${this.iplService.uuid()}`),
    );
  }

  checkDebtOwner(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.iplService.userInfo()?.isPayerDebtOwner) {
        resolve(true);
      } else {
        const lrm = '\u200E';
        this.noticeService.openModal({
          title: 'پرداخت قسط شماره دیگر',
          state: 'info',
          description: `شما در حال پرداخت قسط متعلق به شماره همراه ${lrm}${this.iplService.userInfo()?.cellNumber}${lrm} هستید، تایید می‌کنید.`,
          primaryButtonLabel: 'پرداخت',
          secondaryButtonLabel: 'انصراف',
          isHorizontalAction: true,
        });

        this.noticeService.afterClosed().subscribe((result) => {
          if (result === 'primary') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    });
  }

  internalPayFlow() {
    const payload: GetTicketRequest = {
      ticketRequestDetails: this.iplDetailService.canAggregate()
        ? (this.iplDetailService.registerIplTicketDetails() as AggregationInstallmentFields[])
        : (this.iplService.userInfo()?.dueInstallmentsTicketDetails as AggregationInstallmentFields[]),
    };
    this.creditInstallmentPaymentService.internalFlowPay({
      getTicketPayload: payload,
      callbackUrl: this.#callBackUrlAfterPay(),
      referer: this.iplService.referer() || DefaultInstallmentReferer,
    });
  }

  externalPayFlow() {
    const amount = this.iplDetailService.canAggregate()
      ? this.iplDetailService.registerIplTicketDetails()!.reduce((totalAmount, item) => {
          totalAmount += item.amount;
          return totalAmount;
        }, 0)
      : this.iplService.userInfo()!.totalDebt;
    const payload: GetTicketVersion2Request = {
      aggregateTicketDto: {
        ticketRequestDetails: this.iplDetailService.canAggregate()
          ? (this.iplDetailService.registerIplTicketDetails() as AggregationInstallmentFields[])
          : (this.iplService.userInfo()?.dueInstallmentsTicketDetails as AggregationInstallmentFields[]),
      },
      amount,
    };
    this.creditInstallmentPaymentService.externalFlowPay(payload, amount, this.#callBackUrlAfterPay());
  }

  payByLinkTicketPayFlow() {
    this.creditInstallmentPaymentService.payByLinkTicketFlow(
      this.iplService.uuid(),
      this.iplService.referer() || DefaultInstallmentReferer,
      this.iplDetailService.registerIplTicketDetails(),
      this.#callBackUrlAfterPay(),
    );
  }
}
