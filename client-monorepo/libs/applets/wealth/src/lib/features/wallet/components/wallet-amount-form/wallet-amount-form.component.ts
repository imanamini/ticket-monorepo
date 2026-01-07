import { takeUntil } from 'rxjs';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'wealth-applet-wallet-amount-form',
  standalone: true,
  imports: [ReactiveFormsModule, UiFormFieldBuilderModule, PipesModule],
  templateUrl: './wallet-amount-form.component.html',
  styleUrl: './wallet-amount-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletAmountFormComponent extends BaseComponent implements OnInit, OnChanges {
  formBuilder = inject(FormBuilder);

  title = input<string>();
  placeholder = input<string>('0 ریال');
  amount = input<string>();
  type = input.required<'cashIn' | 'cashOut'>();
  minAmount = input<number>();
  maxAmount = input<number>();
  form: FormGroup;
  amountChange = output<{ value: string; valid: boolean }>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['amount']?.currentValue !== changes['amount']?.previousValue) {
      this.form.controls['amount'].setValue(changes['amount'].currentValue, { emitEvent: false });
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      amount: [],
    });
    this.form.controls['amount'].valueChanges.pipe(takeUntil(this.destroyObservable)).subscribe(() => {
      this.amountChanged();
    });
    if (this.amount()) {
      this.form.controls['amount'].setValue(this.amount(), { emitEvent: false });
    }
  }

  private amountChanged() {
    this.amountChange.emit({ value: this.form.controls['amount'].value, valid: this.isValid() });
  }

  private isValid() {
    return this.form.controls['amount'].value <= this.maxAmount() && this.form.controls['amount'].value >= this.minAmount();
  }
}
