import {Directive, ElementRef, HostListener} from '@angular/core';
import { convertNonEnglishDigits } from '../../utils/strings';

@Directive({
  selector: '[secretInput]'
})
export class SecretInputDirective {

  constructor(private elementRef: ElementRef) {
    const el = this.elementRef.nativeElement;
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
