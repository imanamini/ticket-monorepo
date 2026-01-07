import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiField]'
})
export class FieldMark {

  constructor(
    public template: TemplateRef<any>
  ) {

  }

}
