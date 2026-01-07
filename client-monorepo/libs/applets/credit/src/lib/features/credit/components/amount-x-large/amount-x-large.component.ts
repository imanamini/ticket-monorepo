import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { convertNonEnglishDigits, currencyFormat, numberToString } from '@digipay/strings';
import { FormsModule } from '@angular/forms';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'credit-ui-amount-x-large',
  templateUrl: './amount-x-large.component.html',
  styleUrls: ['./amount-x-large.component.scss'],
  standalone: true,
  imports: [FormsModule, FormDirectivesModule, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountXLargeComponent implements AfterContentInit, AfterViewInit {
  value = model<any>('');

  autoSelect = input(false);

  input = viewChild<ElementRef<HTMLInputElement>>('input');

  valueChanged = output<number>();

  focusStateChanged = output<boolean>();

  baseWidth = 30;

  enabled = input(true);

  maxLength = input(0);

  errorState = input(false);

  placeholder = input('0');

  minAmount = input(0);

  maxAmount = input(0);

  descriptiveValue = signal('');

  rangeError = signal(false);

  inputWidth = signal(this.baseWidth);

  constructor() {
    effect(
      () => {
        const currentValue = this.value();
        if (currentValue) {
          let transformedValue = currentValue;
          if (typeof currentValue === 'number') {
            transformedValue = String(currentValue);
          }
          transformedValue = transformedValue.replace(',', '');

          if (transformedValue !== currentValue) {
            this.value.set(transformedValue);
            this.formatAmount();
            this.calculateWidth();
          }
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.value()) {
        this.value.set(currencyFormat(this.value()));
        this.onValueChanged(this.value());
        this.calculateWidth();
      }
    }, 0);
  }

  ngAfterViewInit(): void {
    if (this.autoSelect()) {
      setTimeout(() => {
        this.wrapperClick();
      }, 10);
    }
  }

  onValueChanged($event: any): void {
    this.value.set($event);
    let amount = +$event.replace(/[^\d]/g, '');
    this.valueChanged.emit(amount);
    this.descriptiveValue.set('');
    this.calculateWidth();
    if ((amount < this.minAmount() || amount > this.maxAmount()) && amount !== 0) {
      this.rangeError.set(true);
      return;
    }
    this.rangeError.set(false);
    if (amount && amount >= 10) {
      amount /= 10;
      const main = Math.floor(amount);
      const decimal = Number((amount - main).toFixed(2));
      const rial = decimal.toString().split('.')[1];

      this.descriptiveValue.set(numberToString(main) + ' ' + 'تومان');
      if (rial && rial !== '0') {
        this.descriptiveValue.update((value) => value + ' و ' + rial + ' ریال ');
      }
    }
  }

  calculateWidth(): void {
    const value = this.value() as string;
    const widthsMap: { [key: number | string]: number } = {
      0: 23,
      1: 16,
      2: 26,
      3: 33,
      4: 30,
      5: 30,
      6: 25,
      7: 30,
      8: 30,
      9: 25,
      '٬': 30,
    };

    let width = 0;
    value.split('').forEach((character) => {
      width += widthsMap[character];
    });

    this.inputWidth.set(width);
  }

  wrapperClick(): void {
    this.input()?.nativeElement.click();
  }

  onInputKeyDown($event: any): void {
    if ($event.key === '0' && this.value() === '') {
      $event.preventDefault();
    }

    let key = $event.key;
    if (key === 'Backspace' || $event.code === 8) {
      // allow deleting
      return;
    }
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) >= 0) {
      return;
    }
    if (!key) {
      return;
    }
    // first convert the value to support FA digits
    key = convertNonEnglishDigits($event.key);
    if (isNaN(+key)) {
      // entered key is not a number
      $event.preventDefault();
      return;
    }
  }

  onInputPaste($event: any) {
    // @ts-ignore
    const clipboardData = $event.clipboardData || window.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = convertNonEnglishDigits(pastedText);
    if (isNaN(+pastedText)) {
      // text is not a number
      $event.preventDefault();
      return;
    }
  }

  inputFocusIn() {
    // emit the state of focus
    this.focusStateChanged.emit(true);
  }

  inputFocusOut() {
    // emit the state of focus
    this.focusStateChanged.emit(false);
  }

  private formatAmount(): void {
    this.value.set(currencyFormat(this.value()));
  }
}
