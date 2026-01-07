import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditInstallmentPaymentFooterRow } from './data-access/credit-installment-payment-footer-row';

@Component({
  selector: 'app-credit-installment-payment-footer',
  templateUrl: './credit-installment-payment-footer.component.html',
  styleUrl: './credit-installment-payment-footer.component.scss',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentPaymentFooterComponent {
  // Inputs
  ctaLabel = input<string>('تایید و پرداخت');
  rows = input<CreditInstallmentPaymentFooterRow[]>([]);
  finalAmount = input.required<number>();
  ctaLoading = input(false);
  ctaIsBrand = input(true);

  // Signals
  detailIsOpen = model(true);

  // Outputs
  cta = output();

  onCta() {
    this.cta.emit();
  }

  detailClickHandler() {
    this.detailIsOpen.update((prev) => !prev);
  }
}
