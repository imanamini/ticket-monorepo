import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { TransactionsApiService } from '@client-monorepo/payment/transactions';
import { PaymentResultStatus, PaymentResultStatusMapper } from '@client-monorepo/payment/purchase';
import { fixActivityInfoArray } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'payment-applet-transaction-result',
  standalone: true,
  imports: [CommonModule, NgxPaymentResult, NgxSkeletonLoadingComponent],
  templateUrl: './transaction-result.component.html',
  styleUrl: './transaction-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionResultComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  location = inject(Location);
  backHandler = inject(BackHandlerService);
  actionHandler = inject(ActionHandlerService);
  transactionService = inject(TransactionsApiService);
  activityId = signal<string | undefined>(undefined);
  result = signal<PaymentResult | undefined>(undefined);
  isLoading = signal(true);
  private readonly actionHandlerService = inject(ActionHandlerService);

  ngOnInit() {
    this.activityId.set(this.route.snapshot.paramMap.get('activityId') ?? '');
    if (this.activityId()) {
      this.getPaymentResult();
    } else {
      this.router.navigate(['/transactions']);
    }
  }

  getPaymentResult(): void {
    this.isLoading.set(true);
    this.transactionService.getPaymentResult(this.activityId() ?? '').subscribe({
      next: (result) => {
        result = {
          ...result,
          bannerImageId: 'receipt-banner-image',
          items: fixActivityInfoArray(result.activityInfo),
          paymentResult:
            PaymentResultStatusMapper[result.status.search('ناموفق') !== -1 ? PaymentResultStatus.FAILED : PaymentResultStatus.SUCCESS],
        };
        this.result.set(result);
        this.isLoading.set(false);
      },
    });
  }

  handleBack(): void {
    this.backHandler.goBack();
  }

  onBannerClicked(): void {
    this.actionHandlerService
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url: 'hub/main-services',
          params: {
            filter: 'mobile',
            referrer: 'pro-banner',
          },
        },
      })
      .then();
  }
}
