import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditInstallmentPaymentFooterRow } from './data-access/credit-installment-payment-footer-row';

@Component({
  selector: 'app-credit-installment-payment-footer',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  templateUrl: './credit-installment-payment-footer.component.html',
})
export class CreditInstallmentPaymentFooterComponent {

  // Inputs
  ctaLabel = input<string>('تایید و پرداخت');
  rows = input<CreditInstallmentPaymentFooterRow[]>([]);
  finalAmount = input.required<number>();

  cta = output();

  onCta() {
    this.cta.emit();
  }
}
