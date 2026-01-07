import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditPaymentService } from '../../../data-access/services/credit-payment.service';
import { currencyFormat } from '@digipay/strings';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditEnoteStateType } from '../models/credit-enote-result';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step-error/credit-enote-step-error.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-enote-step-payment',
  templateUrl: './credit-enote-step-payment.component.html',
  styleUrls: ['./credit-enote-step-payment.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxIcon,
    PipesModule,
    CreditEnoteStepErrorComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepPaymentComponent implements OnInit {
  creditId = input.required<string>();
  fundProviderCode = input.required<number>();
  errorState = signal<CreditEnoteStateType>(null);
  initialized = signal<boolean | null>(null);
  title = signal<string | null>(null);
  amount = signal<number | null>(null);
  guaranteeAmount = signal<number | null>(null);
  icon = signal<string | null>(null);
  detailsItems = signal<string[] | null>(null);
  hintMessage!: string;
  detailsITitle = signal<string | null>(null);
  trackingCode!: string;

  back = output<void>();
  initializingPayment = signal<boolean | null>(null);

  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  creditUrlService = inject(CreditUrlService);
  creditPaymentService = inject(CreditPaymentService);

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig(): void {
    this.creditApiService.getEnotePaymentConfig(this.creditId()).subscribe({
      next: (response) => {
        this.title.set('قابل پرداخت');
        this.icon.set(response.icon);
        this.amount.set(response.payableAmount);
        this.guaranteeAmount.set(response.guaranteeAmount);
        this.detailsITitle.set('بابت');
        this.detailsItems.set([`خرید سفته به مبلغ ${currencyFormat(response.guaranteeAmount)} ریال`]);
        this.trackingCode = response.trackingCode;
        this.initialized.set(true);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.goBack();
      },
    });
  }

  goBack(): void {
    this.back.emit();
  }

  initPayment(): void {
    this.initializingPayment.set(true);
    this.creditApiService
      .enotePaymentInit(
        this.trackingCode,
        this.creditUrlService.getPaymentTicketCallbackUrl('enote', `/${this.fundProviderCode()}/${this.creditId()}`),
        this.creditUrlService.getUrlAfterResult(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${this.fundProviderCode()}/${this.creditId()}`),
        ),
      )
      .subscribe({
        next: (response) => {
          this.creditPaymentService
            .pay(
              'enote',
              response.ticket,
              this.amount()!,
              `/${this.fundProviderCode()}/${this.creditId()}`,
              this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${this.fundProviderCode()}/${this.creditId()}`),
            )
            .then();
        },
        error: (error) => {
          if (this.messageService.isNoServiceError(error)) {
            this.errorState.set('NO_SERVICE');
            return;
          }
          this.messageService.showErrorOfErrorResponse(error);
          this.initializingPayment.set(false);
        },
      });
  }
}
