import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditPaymentService } from '../../../data-access/services/credit-payment.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditEarlySettlementPayConfigResponse } from '../../../data-access/models/credit/installment/credit-early-settlement-pay-config.response';
import { CreditUrlService } from '../../../data-access/utils/url';
import { ActivatedRoute } from '@angular/router';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditPaymentCardComponent } from '../../../components/credit-payment-card/credit-payment-card.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-early-settlement-payment-confirm',
  templateUrl: './credit-early-settlement-payment-confirm.component.html',
  styleUrls: ['./credit-early-settlement-payment-confirm.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditPaymentCardComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementPaymentConfirmComponent implements OnInit {
  payConfig = signal<CreditEarlySettlementPayConfigResponse | null>(null);
  creditId!: string;
  amount = signal<number | null>(null);
  paying = signal<boolean | null>(null);
  gettingConfig = signal<boolean | null>(null);

  private creditApiService = inject(CreditApiService);
  private creditPaymentService = inject(CreditPaymentService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.amount.set(+this.activatedRoute.snapshot.params['amount']);
    this.getConfig();
  }

  getConfig(): void {
    this.gettingConfig.set(true);
    this.creditApiService.getEarlySettlementPayConfig().subscribe({
      next: (response) => {
        this.payConfig.set(response);
        this.gettingConfig.set(false);
      },
      error: (e) => {
        this.gettingConfig.set(false);
        this.goBack();
        this.messageService.showErrorOfErrorResponse(e);
      },
    });
  }

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    this.paying.set(true);
    this.creditApiService
      .initEarlySettlementPay(
        this.creditId,
        this.amount()!,
        this.creditUrlService.getPaymentTicketCallbackUrl('early-settlement', `/${this.creditId}`),
        this.creditUrlService.getUrlAfterResult(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.creditId}`)),
      )
      .subscribe({
        next: (r) => {
          this.paying.set(false);
          this.creditPaymentService
            .pay(
              'early-settlement',
              r.ticket,
              this.amount()!,
              `/${this.creditId}`,
              this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.creditId}`),
            )
            .then();
        },
        error: (e) => {
          this.paying.set(false);
          this.messageService.showErrorOfErrorResponse(e);
        },
      });
  }
}
