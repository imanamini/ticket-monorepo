import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { CreditPaymentResultService } from '../../../data-access/services/credit-payment-result.service';

@Component({
  selector: 'app-credit-payment-callback-installment',
  templateUrl: './credit-payment-callback-installment.component.html',
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentCallbackInstallmentComponent {
  // Services
  private paymentResultService = inject(CreditPaymentResultService);

  // Inputs
  result = input.required<PaymentResult>();

  onCloseClick() {
    this.paymentResultService.navigateTo('/overview');
  }
}
