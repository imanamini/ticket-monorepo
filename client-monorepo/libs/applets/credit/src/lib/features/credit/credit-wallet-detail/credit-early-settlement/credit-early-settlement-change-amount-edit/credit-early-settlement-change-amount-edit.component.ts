import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-early-settlement-change-amount-edit',
  standalone: true,
  imports: [NgxButtonComponent, UiFormFieldBuilderModule, ReactiveFormsModule],
  templateUrl: './credit-early-settlement-change-amount-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementChangeAmountEditComponent implements OnInit {
  usedAmount = input<number | null>(null);
  amountPayableLabel = 'مبلغ قابل پرداخت';
  changeAmountOutput = output<number | null>();
  acceptButtonLabel = 'تایید';
  declineButtonLabel = 'انصراف';

  maxAmount = input.required<number>();
  minAmount = input.required<number>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  handleCancelChangeAmountClick(): void {
    this.changeAmountOutput.emit(null);
  }

  handleAcceptChangeAmountClick(): void {
    this.changeAmountOutput.emit(this.editAmountForm);
  }

  get editAmountForm(): number {
    return this.form.controls['editAmount'].value;
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      editAmount: [this.usedAmount() || '', [Validators.required, Validators.min(this.minAmount()!), Validators.max(this.maxAmount()!)]],
    });
  }
}
