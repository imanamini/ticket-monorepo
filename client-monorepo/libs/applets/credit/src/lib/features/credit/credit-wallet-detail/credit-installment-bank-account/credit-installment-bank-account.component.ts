import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditInstallmentPaymentService } from '../../data-access/services/credit-installment-payment.service';
import { GetConfigRequest } from '../../data-access/models/credit/installment/installments-config.request';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { MessageService } from '../../data-access/services/message.service';
import { BankAccountPageInformationResponse } from '../../data-access/models/credit/installment/bank-account-page-information.response';
import { GetTicketVersion2Request } from '../../data-access/models/credit/installment/installments-ticket.request';
import { CreditNewPaymentService } from '../../data-access/services/credit-new-payment.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Component({
  selector: 'app-credit-installment-bank-account',
  templateUrl: './credit-installment-bank-account.component.html',
  styleUrls: ['./credit-installment-bank-account.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, ApiImageModule, NgxButtonComponent, CreditPageLoadingComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentBankAccountComponent implements OnInit {
  gettingData = signal<boolean | null>(null);
  gettingTicket = signal<boolean | null>(null);
  creditId!: string;
  installmentPayConfigPayload!: GetConfigRequest;
  pageInformation = signal<BankAccountPageInformationResponse | null>(null);
  amount!: number;

  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private creditNewPaymentService = inject(CreditNewPaymentService);
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  iconImageId = computed(() => {
    const iconId = this.pageInformation()?.icon;
    if (!iconId) return '';
    return this.isPillar ? `${iconId}` : iconId;
  });

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.amount = +this.activatedRoute.snapshot.params['amount'];
    this.installmentPayConfigPayload = this.creditInstallmentPaymentService.getInstallmentPayConfigPayload();

    if (!this.installmentPayConfigPayload) {
      window.history.back();
      return;
    }

    this.getData();
  }

  getData() {
    this.gettingData.set(true);
    this.creditApiService.getBankAccountPageInformation(this.creditId).subscribe({
      next: (response) => {
        this.gettingData.set(false);
        this.pageInformation.set(response);
      },
      error: (error) => {
        this.gettingData.set(false);
        this.messageService.showErrorOfErrorResponse(error);
        window.history.back();
      },
    });
  }

  onConfirm() {
    this.gettingTicket.set(true);
    const payload: GetTicketVersion2Request = {
      aggregateTicketDto: this.installmentPayConfigPayload,
      amount: this.amount,
    };
    const callbackUrl = this.creditUrlService.getPaymentTicketCallbackUrl('credit');
    this.creditApiService.getInstallmentTicketVersion2(payload, callbackUrl).subscribe({
      next: (response) => {
        this.creditNewPaymentService.pay(response.ticket, response.redirectUrl!, this.amount);
        this.gettingTicket.set(false);
      },
      error: (error) => {
        this.gettingTicket.set(false);
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  goBack() {
    window.history.back();
  }
}
