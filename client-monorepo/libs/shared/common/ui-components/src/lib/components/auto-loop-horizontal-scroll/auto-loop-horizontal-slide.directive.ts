import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[commonUiAutoLoopHorizontalSlide]',
  standalone: true,
})
export class AutoLoopHorizontalSlideDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
