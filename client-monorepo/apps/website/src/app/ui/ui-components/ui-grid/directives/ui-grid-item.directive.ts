import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appUiGridItem]',
  standalone: true,
})
export class UiGridItemDirective {
  constructor(public template: TemplateRef<any>) {}
}
