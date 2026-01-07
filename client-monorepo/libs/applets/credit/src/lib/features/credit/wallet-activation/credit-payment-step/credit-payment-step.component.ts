import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditPaymentStepConfigResponse } from '../../data-access/models/credit/activation/credit-payment-step-config.response';
import { CreditPaymentService } from '../../data-access/services/credit-payment.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { MessageService } from '../../data-access/services/message.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { PAYMENT_STATUS } from '../../data-access/models/credit/activation/customer-type/customer-type-status';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-payment-step',
  templateUrl: './credit-payment-step.component.html',
  styleUrls: ['./credit-payment-step.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxIcon,
    NgxCalloutComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    PipesModule,
    NgxStatusResultModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentStepComponent implements OnInit {
  fundProviderCode!: number;
  creditId!: string;
  buttons: Buttons[] = [
    {
      id: 'primary',
      label: 'ادامه',
      fullWidth: true,
      style: 'fill',
      mode: 'form',
    },
  ];
  config = signal<CreditPaymentStepConfigResponse | null>(null);
  initialized = signal<boolean | null>(null);
  paying = signal<boolean | null>(null);
  paymentFailed = signal<boolean>(false);

  title = computed(() => (this.paymentFailed() ? 'پرداخت هزینه ثبت‌نام' : 'جزییات پرداخت'));

  bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  paymentService = inject(CreditPaymentService);
  creditUrlService = inject(CreditUrlService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getStatus();
  }

  getStatus() {
    this.creditApiService.getPaymentStepStatus(this.creditId).subscribe({
      next: (response) => {
        if (response.status === PAYMENT_STATUS.FAILED) {
          this.paymentFailed.set(true);
        }
        this.getConfig();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  getConfig(): void {
    this.creditApiService.getPaymentStepConfig(this.creditId, this.fundProviderCode).subscribe((response) => {
      this.config.set(response);
      this.initialized.set(true);
    });
  }

  initPayment(): void {
    this.paying.set(true);
    this.creditApiService
      .initPaymentStep(
        this.creditId,
        this.fundProviderCode,
        this.creditUrlService.getPaymentTicketCallbackUrl('payment-step', `/${this.fundProviderCode}/${this.creditId}`),
        this.creditUrlService.getUrlAfterResult(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
        ),
      )
      .subscribe({
        next: (response) => {
          // this is a temporary code, it will be removed
          if (!response || !response?.ticket) {
            this.goBack();
            return;
          }
          //
          this.paymentService
            .pay(
              'payment-step',
              response.ticket,
              this.config()?.amount,
              `/${this.fundProviderCode}/${this.creditId}`,
              this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
            )
            .then();
          this.paying.set(false);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.paying.set(false);
        },
      });
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }
}
