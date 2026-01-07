import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits, priceFormat } from '../../../utils/strings';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ui-amount-input',
  templateUrl: './ui-amount-input.component.html',
  styleUrls: ['./ui-amount-input.component.scss']
})
export class UiAmountInputComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      amount: [this.value, [
        Validators.required,
        this.rangeValidator.bind(this),
      ]]
    });
  }

  form: FormGroup;
  currentAmountOfInput: number;
  valueChangesSubscription = new Subscription();

  @Input()
  googleAnalyticId: {
    inputClickEvent: string
  };

  @Input()
  value: any = '';

  @Input()
  focusSignal = 0;

  @Input()
  minAmount = 0;

  @Input()
  maxAmount = 0;

  @Input()
  hasCounter = false;

  @Input()
  placeholder = 'مبلغ خود را به ریال وارد کنید.';

  @Input()
  hintText: string;

  @Input()
  counterStep = 500000;

  @Input()
  changeable = true;

  @Output()
  valueChange = new EventEmitter();

  @Output()
  clickEvent = new EventEmitter();

  private static maxValidSize(): number {
    const inputContainerWidth = document.getElementById('ui-amount-input').offsetWidth;
    const amountButtonsSize = 117;
    return inputContainerWidth - amountButtonsSize;
  }

  private static inputValueSmallerThanMaxValidSize(inputValueSize: number, maxValidSize: number): boolean {
    return inputValueSize && inputValueSize < maxValidSize;
  }

  ngOnInit(): void {
    this.currentAmountOfInput = this.value;
    this.changeDetectorRef.detectChanges();
    // listen for form changes
    // replace arabic/persian strings
    this.valueChangesSubscription = this.form.valueChanges.subscribe(value => {
      if (value.amount) {
        const newVal = convertNonEnglishDigits(value.amount);
        if (newVal !== value.amount) {
          this.form.controls['amount'].setValue(newVal, {
            emitEvent: false,
          });
          this.callChangeCallback(newVal);
        }
      }

      this.callChangeCallback(this.form.controls['amount'].value);
    });

    this.callChangeCallback(this.form.controls['amount'].value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentAmountOfInput = changes['value'].currentValue;
    if (changes['value'] && changes['value'].currentValue !== null && changes['value'].currentValue !== changes['value'].previousValue) {
      this.form.controls['amount'].setValue(priceFormat(this.value));
    }
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
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
    return true;
  }

  detectEventCalled(val) {
    this.clickEvent.emit(val);
  }

  increaseValue(): void {
    if (this.currentAmountOfInput !== this.maxAmount) {
      this.currentAmountOfInput = this.createIncreaseNewValue();
      this.detectEventCalled('user click on inc-balance button');
      this.updateAmountControl(this.currentAmountOfInput);
      this.callChangeCallback(this.currentAmountOfInput.toString());
    }
  }

  decreaseValue(): void {
    if (this.currentAmountOfInput !== this.minAmount) {
      this.currentAmountOfInput = this.createDecreaseNewValue();
      this.detectEventCalled('user click on dec-balance button');
      this.updateAmountControl(this.currentAmountOfInput);
      this.callChangeCallback(this.currentAmountOfInput.toString());
    }
  }

  getMinInputWidth(): string {
    const maxValidSize = UiAmountInputComponent.maxValidSize();
    const entireValueSize = this.form.get('amount').value.length * 20;
    if (UiAmountInputComponent.inputValueSmallerThanMaxValidSize(entireValueSize, maxValidSize)) {
      return entireValueSize + 'px';
    }
    return maxValidSize + 'px';
  }

  /**
   * Validate value
   */
  private rangeValidator(control: FormControl) {
    if (!this.minAmount || !this.maxAmount) {
      return null;
    }

    let input = control.value;

    if (typeof input === 'string' && input) {
      input = parseInt(convertNonEnglishDigits(input).replace(/[^\d]/g, ''), 10);
    }

    const isInValid = !(input && +input <= this.maxAmount && +input >= this.minAmount);

    return isInValid ? {
      inRange: {value: input}
    } : null;
  }

  private callChangeCallback(val) {
    this.valueChange.emit({
      value: val ? val : null,
      numericValue: val ? parseInt(val.trim().replace(/[^\d]/g, ''), 10) : null,
    });
  }

  private createIncreaseNewValue(): number {
    const currentValue = this.ChangeCurrentAmountToNumber();
    if (this.counterStep !== this.minAmount && currentValue === this.minAmount) {
      return this.counterStep;
    }
    if (currentValue < this.minAmount) {
      return this.minAmount;
    } else if (currentValue + this.counterStep > this.maxAmount) {
      return this.maxAmount;
    } else {
      return currentValue + this.counterStep;
    }
  }

  private createDecreaseNewValue(): number {
    const currentValue = this.ChangeCurrentAmountToNumber();
    if (currentValue - this.counterStep < this.minAmount) {
      return this.minAmount;
    } else if (currentValue > this.maxAmount) {
      return this.maxAmount;
    } else {
      return currentValue - this.counterStep;
    }
  }

  private ChangeCurrentAmountToNumber(): number {
    if (!this.form.controls['amount'].value) {
      return 0;
    }
    if (isNaN(this.form.controls['amount'].value)) {
      return parseInt(this.form.controls['amount'].value.trim().replace(/[^\d]/g, ''), 10);
    } else {
      return this.form.controls['amount'].value;
    }
  }

  private updateAmountControl(newValue): void {
    this.form.controls['amount'].setValue(newValue, {
      emitEvent: false,
    });
  }
}
