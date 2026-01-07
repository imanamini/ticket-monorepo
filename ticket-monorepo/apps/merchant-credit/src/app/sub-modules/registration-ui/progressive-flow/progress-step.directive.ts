import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[progressStep]'
})
export class ProgressStepDirective {

  constructor(
    public template: TemplateRef<any>
  ) { }

}
