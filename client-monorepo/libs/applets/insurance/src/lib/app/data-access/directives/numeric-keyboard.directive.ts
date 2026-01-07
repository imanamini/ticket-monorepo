import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { convertNonEnglishDigits, currencyFormat } from '@digipay/strings';

@Directive({
  selector: '[numericKeyboard]',
  standalone: true
})
export class NumericKeyboardDirective {

  @Input()
  maxNumber = '';

  @Input()
  emptyValue = '';

  attributeValue = '';

  constructor(private _el: ElementRef) {
    const el = this._el.nativeElement;
    if (el.getAttribute('numericKeyboard')) {
      this.attributeValue = el.getAttribute('numericKeyboard');
    }
    el.setAttribute('type', 'tel');
    el.setAttribute('pattern', '[0-9]*');
  }

  @HostListener('keydown', ['$event']) keydown(event) {
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) inputKeyUp(event) {
    const originalVal = event.target.value;
    let val = convertNonEnglishDigits(event.target.value);
    val = val.replace(/[^\d]/g, '');

    switch (this.attributeValue) {
      case 'card-number':
        if (event.key === 'Backspace' && originalVal[originalVal.length - 1] === '-') {
          // help user to easily remove the last `-` character
          val = originalVal.substr(0, originalVal.length - 1);
        } else {
          if (val.length <= 18) {
            // separate numbers by dash
            val = val.replace(/(\d{4})/ig, '$1-');
          }
        }
        break;
      case 'price':
        val = currencyFormat(val);
        break;
      default:

        break;
    }

    if (originalVal !== val) {
      this._el.nativeElement.value = val;
      this._el.nativeElement.dispatchEvent(new Event('input'));
    }
    if (Number.parseInt(this._el.nativeElement.value, 10) > Number.parseInt(this.maxNumber, 10)) {
      this._el.nativeElement.value = Math.floor(this._el.nativeElement.value / 10) || this.emptyValue;
    }
  }
}
