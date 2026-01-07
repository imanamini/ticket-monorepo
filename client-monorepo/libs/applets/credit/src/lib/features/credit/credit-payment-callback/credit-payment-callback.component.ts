import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPaymentResultService } from '../data-access/services/credit-payment-result.service';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { CacheService } from '../data-access/services/dpx-cache.service';
import { ActivatedRoute } from '@angular/router';
import { CreditTransactionCallbackType } from './data-access/credit-transaction-callback-type';
import {
  CreditPaymentCallbackIplComponent
} from './components/credit-payment-callback-ipl/credit-payment-callback-ipl.component';
import {
  CreditPaymentCallbackInstallmentComponent
} from './components/credit-payment-callback-default/credit-payment-callback-installment.component';
import {
  CreditPaymentCallbackInstallmentsOverviewComponent
} from './components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';

@Component({
  selector: 'app-credit-payment-callback',
  templateUrl: './credit-payment-callback.component.html',
  styleUrls: ['./credit-payment-callback.component.scss'],
  standalone: true,
  imports: [
    CreditPaymentCallbackIplComponent,
    CreditPaymentCallbackInstallmentComponent,
    CreditPaymentCallbackInstallmentsOverviewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentCallbackComponent implements OnInit {
  // Services
  paymentResultService = inject(CreditPaymentResultService);
  cacheService = inject(CacheService);
  private route = inject(ActivatedRoute);

  // Signals
  transactionCallbackType = signal<CreditTransactionCallbackType>(CreditTransactionCallbackType.installment);
  result = signal<PaymentResult | null>(null);
  ready = signal(false);

  protected creditTransactionCallbackType = CreditTransactionCallbackType;

  constructor() {
    this.checkTransactionCallbackType();
  }

  ngOnInit(): void {
    this.cacheService.deleteFromCache('dpx/services/assets', false);
    this.paymentResultService
      .getPaymentResult()
      .then((result) => {
        this.ready.set(true);
        this.result.set(result);
        this.updateInstallmentTempData();
      })
      .catch((error) => {
        console.warn('[CreditPaymentCallback] Failed to get payment result:', error);
        this.ready.set(true);
        // Set a default error result if payment result fails
        this.result.set({
          paymentResult: 'error',
          items: [],
        } as PaymentResult);
      });
  }

  checkTransactionCallbackType() {
    const transactionCallbackType = this.route.snapshot.params['transactionCallbackType'] as CreditTransactionCallbackType;
    if (transactionCallbackType) {
      this.transactionCallbackType.set(transactionCallbackType);
    }
  }

  updateInstallmentTempData() {
    const installmentInfoString = localStorage.getItem('ins-data-temp');
    if (installmentInfoString && this.result() && this.result()?.paymentResult === 'success') {
      const installmentInfo = JSON.parse(installmentInfoString);
      const now = new Date();
      if (+installmentInfo.time > +now - 15 * 60 * 1000) {
        installmentInfo.status = 'success';
        localStorage.setItem('ins-data-temp', JSON.stringify(installmentInfo));
      }
    }
  }
}
