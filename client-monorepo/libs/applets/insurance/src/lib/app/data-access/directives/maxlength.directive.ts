import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[RealMaxlength]',
  standalone: true
})
export class MaxlengthDirective {

  maxLength: number;

  // tslint:disable-next-line:variable-name
  constructor(private _el: ElementRef) {
    const el = this._el.nativeElement;

    // tslint:disable-next-line:radix
    this.maxLength = parseInt(el.getAttribute('RealMaxLength'));

    this.listen(el);
  }

  preventEntering(e): any {
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

  listen(element): void {

    element.addEventListener('keydown', this.preventEntering.bind(this));

    element.addEventListener('keypress', this.preventEntering.bind(this));

    element.addEventListener('keyup', (e) => {
      const val = e.target.value;
      if (val.length > this.maxLength) {
        e.target.value = val.substr(0, this.maxLength);
      }
    });

  }

}
