import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[wallet-mng-applet-uppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    this.ngControl.control?.setValue(value.toUpperCase().trim());
  }
}
