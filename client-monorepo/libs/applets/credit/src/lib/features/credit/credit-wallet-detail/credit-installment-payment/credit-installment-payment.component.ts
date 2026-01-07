import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfigPaymentFlow,
  InstallmentPayConfigResponse,
} from '../../data-access/models/credit/installment/installment-pay-config.response';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditPaymentService } from '../../data-access/services/credit-payment.service';
import { MessageService } from '../../data-access/services/message.service';
import { GetConfigRequest } from '../../data-access/models/credit/installment/installments-config.request';
import { CreditInstallmentPaymentService } from '../../data-access/services/credit-installment-payment.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { GetTicketVersion2Request } from '../../data-access/models/credit/installment/installments-ticket.request';
import { CreditNewPaymentService } from '../../data-access/services/credit-new-payment.service';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditInstallmentPaymentDetailComponent } from './credit-installment-payment-detail/credit-installment-payment-detail.component';
import { CreditInstallmentEditAmountComponent } from './credit-installment-edit-amount/credit-installment-edit-amount.component';
import { InstallmentRefererShortKey } from '../../data-access/models/credit/installment/installment-referer.model';

@Component({
  selector: 'app-credit-installment-payment',
  templateUrl: './credit-installment-payment.component.html',
  styleUrls: ['./credit-installment-payment.component.scss'],
  standalone: true,
  imports: [CreditInstallmentEditAmountComponent, CreditInstallmentPaymentDetailComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentPaymentComponent implements OnInit {
  contractTrackingCode!: string;
  creditId!: string;
  installmentPayConfigPayload!: GetConfigRequest;
  skipBankAccountPage = true;
  referer?: string;

  steps = signal<any[]>([]);
  activeStep = signal(0);
  installmentPayConfig = signal<InstallmentPayConfigResponse | undefined>(undefined);
  gettingData = signal<boolean>(false);
  amount = signal<number | undefined>(undefined);
  paying = signal(false);

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private creditPaymentService = inject(CreditPaymentService);
  private creditNewPaymentService = inject(CreditNewPaymentService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.referer = this.activatedRoute.snapshot.queryParams[InstallmentRefererShortKey];
    this.installmentPayConfigPayload = this.creditInstallmentPaymentService.getInstallmentPayConfigPayload();

    if (!this.installmentPayConfigPayload) {
      window.history.back();
      return;
    }

    this.getData();
  }

  getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getInstallmentPayConfig(this.installmentPayConfigPayload, this.referer).subscribe({
      next: (response) => {
        this.installmentPayConfig.set(response);
        this.setSteps();
        this.setAmount(response.payableAmount);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        window.history.back();
      },
    });
  }

  setSteps(): void {
    if (this.installmentPayConfig()?.partialPaymentEnabled) {
      this.steps.set(['EDIT_AMOUNT', 'PAYMENT_DETAIL']);
    } else {
      this.steps.set(['PAYMENT_DETAIL']);
    }
  }

  setAmount($event: any) {
    this.amount.set($event);
  }

  // Important for partial payment
  syncAmountInSingleContractInstallment() {
    const payload = this.installmentPayConfigPayload;
    if (payload.ticketRequestDetails.length === 1 && payload.ticketRequestDetails[0].count === 1) {
      payload.ticketRequestDetails[0].amount = this.amount()!;
    }
  }

  nextStep() {
    if (this.activeStep() + 1 >= this.steps().length) {
      this.finishFlow();
    } else {
      this.activeStep.update((value) => value + 1);
    }
  }

  prevStep() {
    if (this.activeStep() > 0) {
      this.activeStep.update((value) => value - 1);
    } else {
      window.history.back();
    }
  }

  internalFlowPay() {
    this.paying.set(true);
    this.syncAmountInSingleContractInstallment();
    const callbackUrl = this.creditUrlService.getPaymentTicketCallbackUrl('credit');
    this.creditApiService.getTicketForInstallmentPay(this.installmentPayConfigPayload, callbackUrl, this.referer).subscribe({
      next: (r) => {
        const trackingCodes = this.installmentPayConfigPayload.ticketRequestDetails.map((item) => item.trackingCode);
        const installmentInfo = {
          trackingCodes,
          time: +new Date(),
          status: 'inProgress',
        };
        localStorage.setItem('ins-data-temp', JSON.stringify(installmentInfo));
        this.paying.set(false);
        this.creditPaymentService.pay('credit', r.ticket, this.amount()).then();
      },
      error: (e) => {
        this.paying.set(false);
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }

  externalFlowPay() {
    this.paying.set(true);
    this.syncAmountInSingleContractInstallment();
    const payload: GetTicketVersion2Request = {
      aggregateTicketDto: this.installmentPayConfigPayload,
      amount: this.amount()!,
    };
    const callbackUrl = this.creditUrlService.getPaymentTicketCallbackUrl('credit');
    this.creditApiService.getInstallmentTicketVersion2(payload, callbackUrl).subscribe({
      next: (response) => {
        this.creditNewPaymentService.pay(response.ticket, response.redirectUrl!, this.amount()!);
        this.paying.set(false);
      },
      error: (error) => {
        this.paying.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  private finishFlow() {
    if (this.installmentPayConfig()?.paymentFlow === ConfigPaymentFlow.external) {
      if (this.skipBankAccountPage) {
        return this.externalFlowPay();
      } else {
        const options = JSON.stringify(this.installmentPayConfigPayload.ticketRequestDetails);
        this.router.navigateByUrl(
          this.creditUrlService.getInnerServicePath(`/installment/pay/bank-account/${this.creditId}/${this.amount()}?options=${options}`),
        );
        return;
      }
    }

    this.internalFlowPay();
  }
}
