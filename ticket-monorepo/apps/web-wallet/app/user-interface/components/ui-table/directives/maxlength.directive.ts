import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[RealMaxlength]'
})
export class MaxlengthDirective {

  maxLength: number;

  constructor(
    private _el: ElementRef
  ) {
    let el = this._el.nativeElement;

    this.maxLength = parseInt(el.getAttribute('RealMaxLength'));

    this.listen(el);
  }

  preventEntering(e) {
    if (e.key === 'Backspace' || e.code === 8) {
      return;
    }
    if (['Tab', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) {
      return;
    }
    if (e.target.value.length >= this.maxLength) {
      e.preventDefault();
    }
  }

  listen(element) {

    element.addEventListener('keydown', this.preventEntering.bind(this));

    element.addEventListener('keypress', this.preventEntering.bind(this));

    element.addEventListener('keyup', (e) => {
      let val = e.target.value;
      if (val.length > this.maxLength) {
        e.target.value = val.substr(0, this.maxLength);
      }
    });

  }

}
