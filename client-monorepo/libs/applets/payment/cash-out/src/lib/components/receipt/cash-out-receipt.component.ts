import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

@Component({
  selector: 'cash-out-applet-cash-out-receipt',
  standalone: true,
  imports: [CommonModule, NgxPaymentResult],
  templateUrl: './cash-out-receipt.component.html',
  styleUrl: './cash-out-receipt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashOutReceiptComponent {
  trackingCode = input.required<string>();
  paymentResult = input.required<PaymentResult>();
}
