import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[horizontalSwipeItem]'
})
export class HorizontalSwipeItemDirective {

  constructor(
    public template: TemplateRef<any>
  ) {
  }

}
