import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPaymentResultService } from '../../../data-access/services/credit-payment-result.service';
import { ActivatedRoute } from '@angular/router';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';

@Component({
  selector: 'app-credit-pre-payment-step-result',
  templateUrl: './credit-pre-payment-step-result.component.html',
  styleUrls: ['./credit-pre-payment-step-result.component.scss'],
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPrePaymentStepResultComponent implements OnInit {
  result = signal<PaymentResult | null>(null);
  fundProviderCode!: number;
  creditId!: string;
  ready = signal(false);
  timer = signal<TimerCountDownModel>({
    timeInSeconds: 6,
    timerType: 'mm:ss',
  });

  paymentResultService = inject(CreditPaymentResultService);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.paymentResultService
      .getPaymentResult()
      .then((result) => {
        this.result.set(result);
        this.ready.set(true);
      })
      .catch((error) => {
        console.error('[CreditPrePaymentStepResult] Error getting payment result:', error);
        this.ready.set(true);
        this.onBackButtonClick();
      });
  }

  onBackButtonClick(): void {
    this.paymentResultService.navigateTo(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`);
  }

  onNextButtonClick(): void {
    this.paymentResultService.navigateTo(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`);
  }
}
