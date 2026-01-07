import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits, priceFormat } from '../../../utils/strings';
import { ErrorStateMatcher } from '@angular/material/core';
import { MaxAmountType } from '../models/payment-option.model';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl, form) {
    return control && control.invalid;
  }
}

@Component({
  selector: 'credit-ui-amount-input',
  templateUrl: './credit-ui-amount-input.component.html',
  styleUrls: ['./credit-ui-amount-input.component.scss']
})
export class CreditUiAmountInputComponent implements OnInit, AfterViewInit, OnChanges {

  form: UntypedFormGroup;

  @Input()
  value: any = '';

  @Input()
  focusSignal = 0;

  @ViewChild('inputElement', {
    static: false,
  })
  inputElement: ElementRef<HTMLInputElement>;

  @Input()
  minAmount = 0;

  @Input()
  maxAmount = 0;

  @Input()
  maxAmountType: MaxAmountType;

  @Output()
  valueChange = new EventEmitter();

  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {
    this.form = this.formBuilder.group({
      amount: [this.value, [
        Validators.required,
        this.rangeValidator.bind(this),
      ]]
    });
  }

  ngOnInit() {
    // listen for form changes
    // replace arabic/persian strings
    this.form.valueChanges.subscribe(value => {
      if (value.amount) {
        const newVal = convertNonEnglishDigits(value.amount);
        // newVal = newVal.trim().replace(/[^\d]/g, '');
        if (newVal !== value.amount) {
          this.form.controls.amount.setValue(newVal, {
            emitEvent: false,
          });
          this.callChangeCallback(newVal);
        }
      }

      this.callChangeCallback(this.form.controls.amount.value);
    });

    this.callChangeCallback(this.form.controls.amount.value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusOnInput();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.currentValue !== null && changes.value.currentValue !== changes.value.previousValue) {
      this.form.controls.amount.setValue(priceFormat(this.value));
    }

    if (changes.focusSignal && changes.focusSignal.currentValue !== changes.focusSignal.previousValue) {
      this.focusOnInput();
    }
  }

  /**
   * Validate value
   */
  private rangeValidator(control: UntypedFormControl) {
    if (!this.minAmount || !this.maxAmount) {
      return null;
    }

    let input = control.value;

    if (typeof input === 'string' && input) {
      input = parseInt(convertNonEnglishDigits(input).replace(/[^\d]/g, ''), 10);
    }

    if (+input < this.minAmount) {
      return {
        min: {value: input, min: this.minAmount}
      };
    }

    if (+input > this.maxAmount) {
      return {
        max: {value: input, min: this.maxAmount}
      };
    }

    return null;
  }

  private callChangeCallback(val) {
    this.valueChange.emit({
      value: val ? val : null,
      // tslint:disable-next-line:radix
      numericValue: val ? parseInt(val.trim().replace(/[^\d]/g, '')) : null,
    });
  }

  /**
   * Focus on the amount input
   */
  private focusOnInput() {
    if (this.inputElement && this.inputElement.nativeElement) {
      this.inputElement.nativeElement.focus();
      this.inputElement.nativeElement.setSelectionRange(99999999999, 99999999999);
    }
  }

  /**
   * Prevent entering zero values as the
   * first digit of the amount input
   */
  inputKeyDown($event) {
    // iOS does not provide keyCode in $event.which property
    // key code should extracted using the value
    const code = $event.key.charCodeAt(0);
    const isZero = [48, 1632, 1776].indexOf(code) >= 0;
    if (isZero && $event.target.value.length === 0) {
      $event.preventDefault();
      return false;
    }
  }

  emptyAmount() {
    this.form.controls.amount.setValue('');
  }
}
