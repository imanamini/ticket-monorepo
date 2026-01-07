import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[progressContent]'
})
export class ProgressContentDirective {

  constructor(
    public template: TemplateRef<any>
  ) { }

}
