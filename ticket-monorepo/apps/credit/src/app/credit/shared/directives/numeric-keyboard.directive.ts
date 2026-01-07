import { Directive, ElementRef, HostListener } from '@angular/core';
import { convertNonEnglishDigits, priceFormat } from '../../../utils/strings';

@Directive({
  selector: '[numericKeyboard]'
})
export class NumericKeyboardDirective {

  attributeValue = '';

  constructor(private elRef: ElementRef) {
    const el = this.elRef.nativeElement;
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
      case 'price':
        val = priceFormat(val);
        break;
      default:
        break;
    }

    if (originalVal !== val) {
      this.elRef.nativeElement.value = val;
      this.elRef.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}
