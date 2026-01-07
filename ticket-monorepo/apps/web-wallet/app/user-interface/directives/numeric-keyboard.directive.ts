import { Directive, ElementRef, HostListener } from '@angular/core';
import { convertNonEnglishDigits, priceFormat } from '../../utils/strings';

@Directive({
  selector: '[numericKeyboard]'
})
export class NumericKeyboard {

  constructor(private _el: ElementRef) {
    const el = this._el.nativeElement;
    if (el.getAttribute('numericKeyboard')) {
      this.attributeValue = el.getAttribute('numericKeyboard');
    }
    el.setAttribute('type', 'tel');
    el.setAttribute('pattern', '[0-9]*');
  }

  attributeValue = '';

  private static removeFirstZeroCharacter(value: string): string {
    const firstCharacter = value.charAt(0);
    if (firstCharacter === '0') {
      return value.substring(1);
    }
    return value;
  }

  @HostListener('keydown', ['$event']) keydown(event) {
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) inputKeyUp(event) {
    this.convert(event);
  }

  @HostListener('mousemove', ['$event']) inputMouseMove(event) {
    this.convert(event);
  }

  private convert(event): void {
    const originalVal = event.target.value;
    let val = convertNonEnglishDigits(event.target.value);
    val = val.replace(/[^\d]/g, '');
    switch (this.attributeValue) {
      case 'price':
        val = NumericKeyboard.removeFirstZeroCharacter(val);
        val = priceFormat(val);
        break;
      default:
        break;
    }
    if (originalVal !== val) {
      this._el.nativeElement.value = val;
      this._el.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}
