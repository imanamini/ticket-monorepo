import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tableRow]'
})
export class TableRowMarkDirective {

  constructor(
    public template: TemplateRef<any>
  ) {
  }
}
