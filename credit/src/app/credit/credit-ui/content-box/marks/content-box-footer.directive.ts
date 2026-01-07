import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[contentBoxFooter]'
})
export class ContentBoxFooterDirective {

  constructor(
    public template: TemplateRef<any>
  ) {

  }

}
