import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[contentBoxFooter]',
  standalone: true
})
export class ContentBoxFooterDirective {
  constructor(public template: TemplateRef<any>) {
  }
}
