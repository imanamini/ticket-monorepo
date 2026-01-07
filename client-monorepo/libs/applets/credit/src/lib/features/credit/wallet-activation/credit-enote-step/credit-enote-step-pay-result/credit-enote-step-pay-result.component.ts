import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditPaymentResultService } from '../../../data-access/services/credit-payment-result.service';
import { ActivatedRoute } from '@angular/router';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxPaymentResult, PaymentResult } from '@digipay/ngx-payment-result';

@Component({
  selector: 'app-credit-enote-step-pay-result',
  templateUrl: './credit-enote-step-pay-result.component.html',
  styleUrls: ['./credit-enote-step-pay-result.component.scss'],
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepPayResultComponent implements OnInit {
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
        console.error('[CreditEnoteStepPayResult] Error getting payment result:', error);
        this.ready.set(true);
        this.onBackButtonClick();
      });
  }

  onBackButtonClick(): void {
    this.paymentResultService.navigateTo(`/wallet/activation/enote/resolve/${this.fundProviderCode}/${this.creditId}`);
  }
}
