import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { convertNonEnglishDigits, currencyFormat } from '@digipay/strings';
import { priceFormat } from '../../../utils/strings';
import { numberToString } from '../../../utils/number-to-string';

@Component({
  selector: 'ui-input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss']
})
export class InputAmountComponent implements OnInit, AfterContentInit, OnChanges, AfterViewInit {

  @Input()
  value: any = '';

  @Input()
  autoSelect = false;

  @ViewChild('input')
  input: ElementRef<HTMLInputElement> | undefined;

  @Output()
  valueChanged = new EventEmitter();

  @Output()
  focusInChanged = new EventEmitter();

  @Output()
  focusOutChanged = new EventEmitter();

  baseWidth = 30;

  @Input()
  enabled = true;

  @Input()
  maxLength = 0;

  @Input()
  errorState = false;

  @Input()
  placeholder = '0';

  @Input()
  minAmount = 0;

  @Input()
  maxAmount = 0;

  descriptiveValue = '';

  rangeError = false;

  convertMessage = false;

  inputWidth = this.baseWidth;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      let v = this.value;
      if (typeof v === 'number') {
        v = String(v);
      }
      this.value = v.replace(/[^\d]/g, '');
      this.formatAmount();
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.value) {
        this.value = priceFormat(this.value);
        this.valueChanged.emit(this.value);
        this.input?.nativeElement.focus();
        this.calculateWidth();
      }
    }, 0);
  }

  ngAfterViewInit(): void {
    if (this.autoSelect) {
      setTimeout(() => {
        this.wrapperClick(null);
      }, 10);
    }
  }

  onValueChanged($event: any): void {
    this.value = $event.replace(/[^\d]/g, '');
    this.valueChanged.emit(this.value);
    let amount = +this.value;
    this.calculateWidth();

    this.rangeError = true;

    if (amount < this.minAmount || amount > this.maxAmount) {
      this.descriptiveValue = ` مبلغ باید بین ${currencyFormat(this.minAmount)} ریال تا ${currencyFormat(this.maxAmount)}ریال باشد`;
    } else if (amount < this.minAmount) {
      this.descriptiveValue = ` مبلغ بایداز${currencyFormat(this.minAmount)} ریال بزرگتر باشد`;
    } else if (amount > this.maxAmount) {
      this.descriptiveValue = `مبلغ بایداز${currencyFormat(this.minAmount)} ریال بزرگتر باشد`;
    } else {
      this.convertMessage = true;
      this.rangeError = false;
      amount /= 10;
      const main = Math.floor(amount);
      const decimal = Number((amount - main).toFixed(2));
      const rial = (decimal.toString()).split('.')[1];

      this.descriptiveValue = numberToString(main) + ' ' + 'تومان';
      if (rial && rial !== '0') {
        this.descriptiveValue += ' و ' + rial + ' ریال ';
      }
    }
  }

  calculateWidth(): void {
    const value = this.value as string;
    const widthsMap: any = {
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
      '/': 30,
      '٬': 25,
    };

    let width = 0;
    value.split('').forEach(character => {
      width += widthsMap[character];
    });

    this.inputWidth = width;
  }

  private formatAmount(): void {
    this.value = priceFormat(this.value);
  }

  wrapperClick($event: any): void {
    if (this.input) {
      this.input.nativeElement.click();
    }
  }

  onInputKeyDown($event: any): void {
    if ($event.key === '0' && this.value === '') {
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
    this.focusInChanged.emit(true);
  }

  inputFocusOut() {
    // emit the state of focus
    this.focusOutChanged.emit(false);
  }
}
