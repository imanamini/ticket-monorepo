import { ChangeDetectionStrategy, Component, input, model, OnInit, output, signal } from '@angular/core';
import { InstallmentPayConfigResponse } from '../../../data-access/models/credit/installment/installment-pay-config.response';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AmountXLargeComponent } from '../../../components/amount-x-large/amount-x-large.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-installment-edit-amount',
  templateUrl: './credit-installment-edit-amount.component.html',
  styleUrls: ['./credit-installment-edit-amount.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, AmountXLargeComponent, NgxButtonComponent, UiFormFieldBuilderModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentEditAmountComponent implements OnInit {
  installmentPayConfig = input<InstallmentPayConfigResponse>();
  amount = model<number>();
  amountFocused = signal(false);
  validAmount = signal(false);

  prevStep = output<void>();
  nextStep = output<void>();
  changeAmount = output<number>();

  ngOnInit(): void {
    this.setAmount(this.installmentPayConfig()?.payableAmount);
  }

  setAmount($event: any) {
    this.amount.set($event);
    this.validAmount.set(
      this.amount()! >= this.installmentPayConfig()!.minAmount && this.amount()! <= this.installmentPayConfig()!.maxAmount,
    );
  }

  goBack() {
    this.prevStep.emit();
  }

  goForward() {
    this.changeAmount.emit(this.amount()!);
    this.nextStep.emit();
  }
}
