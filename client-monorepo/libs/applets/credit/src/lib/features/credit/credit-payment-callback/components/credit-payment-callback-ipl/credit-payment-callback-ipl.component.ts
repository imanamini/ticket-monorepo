import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { CreditPaymentResultService } from '../../../data-access/services/credit-payment-result.service';

@Component({
  selector: 'app-credit-payment-callback-ipl',
  templateUrl: './credit-payment-callback-ipl.component.html',
  standalone: true,
  imports: [NgxPaymentResult],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentCallbackIplComponent {
  // Services
  private route = inject(ActivatedRoute);
  private paymentResultService = inject(CreditPaymentResultService);

  // Inputs
  result = input.required<PaymentResult>();

  // Signals
  uuid = signal<string | null>(null);

  constructor() {
    this.checkUuid();
  }

  checkUuid() {
    const uuid = this.route.snapshot.queryParams['uuid'];
    uuid && this.uuid.set(uuid);
  }

  onCloseClick() {
    const url = this.uuid() ? `/ipl/${this.uuid()}` : '/overview';
    this.paymentResultService.navigateTo(url);
  }
}
