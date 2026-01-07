import { Directive, ElementRef, HostListener } from '@angular/core';
import { convertNonEnglishDigits } from '../../../utils/strings';

@Directive({
  selector: '[CellNumberInput]'
})
export class CellNumberInputDirective {

  constructor(private _el: ElementRef) {

    let el = this._el.nativeElement;

    el.setAttribute('type', 'tel');
    el.setAttribute('pattern', '[0-9]*');

    this.setEventListeners(el);
  }

  setEventListeners(element: Element) {
    element.addEventListener('keypress', this.keyDownHandler);
    element.addEventListener('keydown', this.keyDownHandler);
    element.addEventListener('keyup', this.keyUpHandler);
  }

  keyUpHandler(event) {
    if (event.key === 'Backspace') {
      return;
    }
    let val = event.target.value;

    val = convertNonEnglishDigits(val);

    if (val.length > 11) {
      val = val.substr(0, 11);
    }

    // replace everything except numbers
    val = val.replace(/[^\d]/g, '');

    event.target.value = val;
  }

  keyDownHandler(event) {
    if (event.key === 'e') {
      event.preventDefault();
    }
    if (event.target.value.length === 11 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    this._el.nativeElement.value = convertNonEnglishDigits(event.target.value);
  }

}
