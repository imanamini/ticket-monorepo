import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[swiper-item]',
  standalone: true
})
export class ListDirective {

  constructor(
    public template: TemplateRef<any>
  ) {
  }

}
