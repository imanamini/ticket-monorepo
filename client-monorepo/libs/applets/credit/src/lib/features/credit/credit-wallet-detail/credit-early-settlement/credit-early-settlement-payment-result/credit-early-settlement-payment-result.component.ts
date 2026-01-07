import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPaymentResultService } from '../../../data-access/services/credit-payment-result.service';
import { ActivatedRoute } from '@angular/router';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { CacheService } from '../../../data-access/services/dpx-cache.service';

@Component({
  selector: 'app-credit-early-settlement-payment-result',
  templateUrl: './credit-early-settlement-payment-result.component.html',
  styleUrls: ['./credit-early-settlement-payment-result.component.scss'],
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementPaymentResultComponent implements OnInit {
  result = signal<PaymentResult | null>(null);
  creditId!: string;
  ready = signal(false);
  timer = signal<TimerCountDownModel>({
    timeInSeconds: 6,
    timerType: 'mm:ss',
  });
  paymentResultService = inject(CreditPaymentResultService);
  activatedRoute = inject(ActivatedRoute);
  cacheService = inject(CacheService);

  ngOnInit(): void {
    this.cacheService.deleteFromCache('dpx/services/assets', false);
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.paymentResultService
      .getPaymentResult()
      .then((result) => {
        this.result.set(result);
        this.ready.set(true);
      })
      .catch((error) => {
        console.error('[CreditEarlySettlementPaymentResult] Error getting payment result:', error);
        this.ready.set(true);
        // Navigate back on error
        this.onBackButtonClick();
      });
  }

  onBackButtonClick(): void {
    // Should go to detail later
    this.paymentResultService.navigateTo(`/overview`);
  }
}
