import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // @ts-ignore
    this.ngControl.control.setValue(value.toUpperCase().trim());
  }
}
