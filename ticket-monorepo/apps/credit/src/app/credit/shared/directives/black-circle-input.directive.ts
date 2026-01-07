import { Directive, ElementRef, HostListener } from '@angular/core';
import { convertNonEnglishDigits } from '../../../utils/strings';

@Directive({
  selector: '[circleInput]'
})
export class CircleInputDirective {

  constructor(private _el: ElementRef) {
    let el = this._el.nativeElement;
    el.setAttribute('type', 'tel');
    el.setAttribute('pattern', '[0-9]*');
  }

  @HostListener('keydown', ['$event']) keydown(event) {
    if (event.key === 'e') {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) inputKeyUp(event) {
    let val = convertNonEnglishDigits(event.target.value);
    val = val.replace(/[\d]/g, '⬤');
    event.target.value = val;
  }

}
