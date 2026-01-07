import { Directive, ElementRef, HostListener } from '@angular/core';
import { convertNonEnglishDigits, priceFormat } from '../utils/strings';

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
    setTimeout(() => {
      if (el.value) {
        el.value = this.transform(el.value);
      }
    }, 0);
  }


  @HostListener('keydown', ['$event']) keydown(event: any) {
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) inputKeyUp(event:any) {
    const originalVal = event.target.value;
    const val = this.transform(event.target.value);

    if (originalVal !== val) {
      this.elRef.nativeElement.value = val;
      this.elRef.nativeElement.dispatchEvent(new Event('input'));
    }
  }

  transform(input: string) {
    let val = convertNonEnglishDigits(input);
    val = val.replace(/[^\d]/g, '');
    switch (this.attributeValue) {
      case 'price':
        val = priceFormat(val);
        break;
      default:
        break;
    }
    return val;
  }
}
