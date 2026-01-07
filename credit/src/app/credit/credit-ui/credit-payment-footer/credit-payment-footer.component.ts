import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditPaymentFooterRow } from './data-access/credit-payment-footer-row';

@Component({
  selector: 'app-credit-payment-footer',
  templateUrl: './credit-payment-footer.component.html',
  styleUrl: './credit-payment-footer.component.scss',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPaymentFooterComponent {
  // Inputs
  rows = input<CreditPaymentFooterRow[]>([]);
  finalAmount = input.required<number>();
  finalAmountTitle = input<string>('مبلغ پرداختی');
  primaryButton = input<string>('تایید و پرداخت');
  primaryButtonDisabled = input(false);
  secondaryButton = input<string>();
  secondaryButtonDisabled = input(false);

  // Signals
  detailIsOpen = signal(true);

  // Outputs
  primaryClicked = output();
  secondaryClicked = output();

  detailClickHandler() {
    this.detailIsOpen.update((prev) => !prev);
  }

  onPrimaryClicked() {
    this.primaryClicked.emit();
  }

  onSecondaryClicked() {
    this.secondaryClicked.emit();
  }
}
