import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderResponse } from '../../data-access/models/order.interface';
import { currencyFormat } from '@digipay/strings';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'escrow-purchase-flow-applet-price-input',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule],
  templateUrl: './amount-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountInputComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  order = input<OrderResponse>();
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  amountFormGroup!: FormGroup;
  amount = output<{ valid: boolean; value: string | null }>();
  errorMessageMapper = {};
  currentOrder = computed(() => this.order());
  UPGMaxAmount = 1000000000;

  constructor() {
    effect(() => {
      const order = this.currentOrder();
      if (order) {
        this.updateValidators(order.minimumAmount);
      }
    });
  }

  ngOnInit(): void {
    this.amountFormGroup = this.fb.group({
      amount: [null, [Validators.required]],
    });
    this.emitAmountValidation();
  }

  emitAmountValidation() {
    this.amountFormGroup.controls['amount'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string | null) => {
      if (value) {
        const amount = Number(value);
        const minAmount = this.currentOrder()?.minimumAmount ?? 0;
        const isValid = amount >= minAmount && amount <= this.UPGMaxAmount;
        this.updateValidators(minAmount);
        this.amount.emit({ valid: isValid, value: value });
        this.cdr.markForCheck();
      }
    });
  }

  checkKeyCode(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      return;
    }
  }

  get hint(): string {
    const minimumAmount = currencyFormat(this.currentOrder()?.minimumAmount ?? 0);
    return `حداقل مبلغ برای خرید ${minimumAmount} ریال می‌باشد.`;
  }

  updateValidators(minAmount: number) {
    this.errorMessageMapper = {
      min: `حداقل مبلغ برای خرید ${currencyFormat(minAmount)} ریال می‌باشد`,
      max: `حداکثر مبلغ برای خرید ${currencyFormat(this.UPGMaxAmount)} ریال می‌باشد`,
    };
    const amountControl = this.amountFormGroup.get('amount');
    amountControl?.setValidators([Validators.required, Validators.min(minAmount), Validators.max(this.UPGMaxAmount)]);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
