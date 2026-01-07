import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appUiSectionFooter]',
  standalone: true,
})
export class UiSectionFooterDirective {
  constructor(public template: TemplateRef<any>) {}
}
