import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appUiSectionHeaderIcon]',
  standalone: true,
})
export class UiSectionHeaderIconDirective {
  constructor(public template: TemplateRef<any>) {}
}
